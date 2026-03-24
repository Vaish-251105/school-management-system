import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/theme_service.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../auth/login_screen.dart';
import '../modules/fees_screen.dart';

import './salary_screen.dart';
import '../admin/staff_attendance.dart';
import '../modules/notification_screen.dart';

class AccountantDashboard extends StatefulWidget {
  const AccountantDashboard({super.key});

  @override
  State<AccountantDashboard> createState() => _AccountantDashboardState();
}

class _AccountantDashboardState extends State<AccountantDashboard> {
  bool _isLoading = true;
  double _todayCollection = 0;
  double _monthCollection = 0;
  double _pendingDues = 0;
  List<dynamic> _recentTxs = [];

  @override
  void initState() {
    super.initState();
    _loadFinanceData();
  }

  Future<void> _loadFinanceData() async {
    setState(() => _isLoading = true);
    try {
      final fees = await ApiService.getFees();
      final expenses = await ApiService.getExpenses();
      
      double today = 0;
      double month = 0;
      double pending = 0;
      
      final now = DateTime.now();
      
      for (var f in fees) {
        double amt = (f['amount'] ?? 0).toDouble();
        bool isPaid = f['paid'] == true || f['status'] == 'paid';
        
        if (isPaid) {
          DateTime paidDate = DateTime.parse(f['paidDate'] ?? f['updatedAt'] ?? f['createdAt']);
          if (paidDate.day == now.day && paidDate.month == now.month && paidDate.year == now.year) {
            today += amt;
          }
          if (paidDate.month == now.month && paidDate.year == now.year) {
            month += amt;
          }
        } else {
          pending += amt;
        }
      }

      // Combine for recent txs
      List<dynamic> combined = [];
      combined.addAll(fees.map((f) => {...f, 'isFee': true}));
      combined.addAll(expenses.map((e) => {...e, 'isFee': false}));
      combined.sort((a, b) => b['createdAt'].toString().compareTo(a['createdAt'].toString()));

      if (mounted) {
        setState(() {
          _todayCollection = today;
          _monthCollection = month;
          _pendingDues = pending;
          _recentTxs = combined.take(5).toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<ThemeProvider>().isDarkMode;
    final userName = context.watch<AuthService>().name;
    
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : RefreshIndicator(
            onRefresh: _loadFinanceData,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                children: [
                  // HEADER
                  Container(
                    padding: const EdgeInsets.fromLTRB(24, 60, 24, 40),
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFF0D9488), Color(0xFF0F766E)],
                      ),
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(50),
                        bottomRight: Radius.circular(50),
                      ),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("Finance Portal",
                                    style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                                const SizedBox(height: 4),
                                Text("Hello, ${userName.split(' ')[0]}",
                                    style: const TextStyle(fontSize: 28, color: Colors.white, fontWeight: FontWeight.bold)),
                              ],
                            ),
                            Row(
                              children: [
                                IconButton(
                                  onPressed: () => context.read<ThemeProvider>().toggleTheme(),
                                  icon: Icon(isDark ? LucideIcons.sun : LucideIcons.moon, color: Colors.white),
                                ),
                                const SizedBox(width: 8),
                                GestureDetector(
                                  onTap: () {
                                    context.read<AuthService>().logout();
                                    Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                                  },
                                  child: const CircleAvatar(
                                    radius: 26,
                                    backgroundColor: Colors.white24,
                                    child: Icon(LucideIcons.logOut, color: Colors.white, size: 22),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        _buildStatsRow(),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),
                  
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Financial Actions",
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                        const SizedBox(height: 16),
                        GridView.count(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          mainAxisSpacing: 16,
                          crossAxisSpacing: 16,
                          childAspectRatio: 1.4,
                          children: [
                            _buildFinCard(context, "Fees", "Payments", LucideIcons.plusCircle, Colors.teal, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FeesScreen()))),
                            _buildFinCard(context, "Expenses", "Spend Log", LucideIcons.trendingDown, Colors.red, () => _showExpenseEntry()),
                            _buildFinCard(context, "Payroll", "Salaries", LucideIcons.users, Colors.indigo, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SalaryScreen()))),
                            _buildFinCard(context, "Staff Attendance", "Logs", LucideIcons.userCheck, Colors.orange, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StaffAttendanceScreen()))),
                            _buildFinCard(context, "Notices", "Bulk", LucideIcons.megaphone, Colors.pink, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen()))),
                            _buildFinCard(context, "Sync", "Refresh", LucideIcons.refreshCw, Colors.green, _loadFinanceData),
                          ],
                        ),
                        
                        const SizedBox(height: 32),
                        Text("Recent Ledger Logs",
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                        const SizedBox(height: 16),
                        ..._recentTxs.map<Widget>((tx) => _buildTxTile(
                          tx['isFee'] ? (tx['studentId']?['name'] ?? "Student Fee") : (tx['title'] ?? "Expense"), 
                          tx['isFee'] ? "Fee Receipt" : "Operation Spend", 
                          "${tx['isFee'] ? '+' : '-'} ₹${tx['amount']}", 
                          tx['isFee'] ? Colors.green : Colors.red
                        )),
                        if (_recentTxs.isEmpty) 
                          const Padding(padding: EdgeInsets.all(40), child: Center(child: Text("No transactions yet"))),
                      ],
                    ),
                  ),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
    );
  }

  void _showExpenseEntry() {
    final titleController = TextEditingController();
    final amountController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Record New Expense"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleController, decoration: const InputDecoration(labelText: "Description")),
            TextField(controller: amountController, decoration: const InputDecoration(labelText: "Amount"), keyboardType: TextInputType.number),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              await ApiService.createExpense({
                "title": titleController.text,
                "amount": double.tryParse(amountController.text) ?? 0,
                "date": DateTime.now().toIso8601String()
              });
              Navigator.pop(context);
              _loadFinanceData();
            }, 
            child: const Text("Save Record")
          )
        ],
      )
    );
  }

  Widget _buildStatsRow() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _statItem("Today", "₹${_todayCollection.toStringAsFixed(0)}"),
          Container(height: 30, width: 1, color: Colors.white10),
          _statItem("Month", "₹${(_monthCollection/1000).toStringAsFixed(1)}k"),
          Container(height: 30, width: 1, color: Colors.white10),
          _statItem("Dues", "₹${(_pendingDues/1000).toStringAsFixed(1)}k"),
        ],
      ),
    );
  }

  Widget _statItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        Text(label, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11)),
      ],
    );
  }

  Widget _buildFinCard(BuildContext context, String title, String sub, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 28),
            const Spacer(),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            Text(sub, style: TextStyle(color: Colors.grey.shade500, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  Widget _buildTxTile(String name, String label, String amount, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
            child: Icon(amount.contains('+') ? LucideIcons.arrowUpRight : LucideIcons.arrowDownLeft, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
          Text(amount, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 16)),
        ],
      ),
    );
  }
}
