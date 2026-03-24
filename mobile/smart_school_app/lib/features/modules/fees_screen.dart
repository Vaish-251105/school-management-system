import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';

import '../../services/api_service.dart';

class FeesScreen extends StatefulWidget {
  const FeesScreen({super.key});

  @override
  State<FeesScreen> createState() => _FeesScreenState();
}

class _FeesScreenState extends State<FeesScreen> {
  List<dynamic> _fees = [];
  bool _isLoading = true;
  double _totalCollection = 0;
  double _received = 0;
  double _pending = 0;

  @override
  void initState() {
    super.initState();
    _loadFees();
  }

  Future<void> _loadFees() async {
    setState(() => _isLoading = true);
    final data = await ApiService.getFees();
    double total = 0;
    double rec = 0;
    double pen = 0;
    
    for (var f in data) {
      double amt = (f['amount'] ?? 0).toDouble();
      total += amt;
      if (f['status'] == 'paid') {
        rec += amt;
      } else {
        pen += amt;
      }
    }

    if (mounted) {
      setState(() {
        _fees = data;
        _totalCollection = total;
        _received = rec;
        _pending = pen;
        _isLoading = false;
      });
    }
  }

  Future<void> _collectFee() async {
     final amountController = TextEditingController();
    final titleController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Collect New Fee"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleController, decoration: const InputDecoration(labelText: "Fee Title (e.g. Tuition)")),
            TextField(controller: amountController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: "Amount")),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
               await ApiService.createFee({
                "title": titleController.text,
                "amount": double.tryParse(amountController.text) ?? 0,
                "status": "pending",
                "dueDate": DateTime.now().add(const Duration(days: 30)).toIso8601String(),
              });
              Navigator.pop(context);
              _loadFees();
            }, 
            child: const Text("Create")
          ),
        ],
      ),
    );
  }

  Future<void> _markPaid(String id) async {
    await ApiService.updateFee(id, {"status": "paid"});
    _loadFees();
  }

  Future<void> _payNow(String id) async {
    final transactionId = "TXN${DateTime.now().millisecondsSinceEpoch}";
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Confirm Payment"),
        content: const Text("Are you sure you want to proceed with this payment? This will simulate a secure transaction."),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              await ApiService.payFee(id, transactionId);
              if (mounted) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Payment successful! TXN: $transactionId"), backgroundColor: Colors.green),
                );
                _loadFees();
              }
            }, 
            child: const Text("Pay Now")
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final user = context.watch<AuthService>();
    final userRole = user.role.toLowerCase();
    bool canManage = userRole == 'admin' || userRole == 'accountant';

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: const Color(0xFF4F46E5),
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft, color: Colors.white)),
        title: const Text("Fees & Payments", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [IconButton(onPressed: _loadFees, icon: const Icon(LucideIcons.refreshCcw, color: Colors.white))],
        elevation: 0,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : RefreshIndicator(
            onRefresh: _loadFees,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                children: [
                  // TOTAL COLLECTION HEADER
                  Container(
                    padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
                    decoration: const BoxDecoration(
                      color: Color(0xFF4F46E5),
                      borderRadius: BorderRadius.only(bottomLeft: Radius.circular(40), bottomRight: Radius.circular(40)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("Total Collection", style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Text("\$${_totalCollection.toStringAsFixed(2)}", style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(20)),
                              child: const Row(children: [Icon(LucideIcons.trendingUp, color: Colors.white, size: 10), SizedBox(width: 4), Text("+12.5%", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold))]),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            Expanded(child: _miniStat("Received", "\$${_received.toStringAsFixed(0)}")),
                            Container(width: 1, height: 30, color: Colors.white24),
                            Expanded(child: _miniStat("Pending", "\$${_pending.toStringAsFixed(0)}")),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                  // TRANSACTIONS
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("All Transactions", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: isDark ? Colors.white : AppColors.textDark)),
                      ],
                    ),
                  ),

                  if (_fees.isEmpty)
                    const Padding(padding: EdgeInsets.all(40), child: Center(child: Text("No fee records found"))),

                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(24),
                    itemCount: _fees.length,
                    itemBuilder: (context, index) {
                      final f = _fees[index];
                      // Determine status
                      String rawStatus = (f['status'] ?? f['paid'] == true ? 'paid' : 'pending').toString().toLowerCase();
                      
                      return _feeCard(
                        context, 
                        f['_id'],
                        f['title'] ?? (f['type'] != null ? "${f['type']} Fee" : "School Fee"), 
                        f['studentId']?['name'] ?? "Assigned Student", 
                        f['dueDate']?.toString().split('T')[0] ?? "--", 
                        "\$${f['amount'] ?? 0}", 
                        rawStatus == "paid" ? "Paid" : "Pending",
                        canManage,
                        userRole == 'student' || userRole == 'parent'
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
      floatingActionButton: canManage 
        ? FloatingActionButton.extended(
            onPressed: _collectFee,
            backgroundColor: theme.primaryColor,
            icon: const Icon(LucideIcons.plus, color: Colors.white),
            label: const Text("Create Fee", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          )
        : null,
    );
  }

  Widget _miniStat(String label, String value) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11)),
      Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
    ]);
  }

  Widget _feeCard(BuildContext context, String id, String title, String student, String date, String amount, String status, bool canManage, bool canPay) {
    bool isPaid = status == "Paid";

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text("Reference ID: ${id.length > 6 ? id.substring(id.length - 6) : id}", style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
              ])),
              Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: (isPaid ? Colors.green : Colors.orange).withOpacity(0.1), borderRadius: BorderRadius.circular(8)), child: Text(status, style: TextStyle(color: isPaid ? Colors.green : Colors.orange, fontSize: 9, fontWeight: FontWeight.bold))),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text("Due Date", style: TextStyle(color: AppColors.textLight, fontSize: 10)),
                Text(date, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              ]),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                const Text("Amount", style: TextStyle(color: AppColors.textLight, fontSize: 10)),
                Text(amount, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Theme.of(context).primaryColor)),
              ]),
            ],
          ),
          if (!isPaid) ...[
            const SizedBox(height: 20),
            Row(
              children: [
                if (canManage)
                  Expanded(
                    child: GestureDetector(
                      onTap: () => _markPaid(id),
                      child: _actionButton(context, LucideIcons.checkCircle, "Mark Paid", Theme.of(context).primaryColor.withOpacity(0.1), Theme.of(context).primaryColor),
                    )
                  ),
                if (canManage && canPay) const SizedBox(width: 12),
                if (canPay)
                  Expanded(
                    child: GestureDetector(
                      onTap: () => _payNow(id),
                      child: _actionButton(context, LucideIcons.banknote, "Pay Now", Colors.green.withOpacity(0.1), Colors.green),
                    )
                  ),
              ],
            ),
          ]
        ],
      ),
    );
  }

  Widget _actionButton(BuildContext context, IconData icon, String label, Color bg, Color fg) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(icon, size: 14, color: fg), const SizedBox(width: 8), Text(label, style: TextStyle(color: fg, fontSize: 11, fontWeight: FontWeight.bold))]),
    );
  }
}