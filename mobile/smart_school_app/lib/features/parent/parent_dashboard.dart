import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/theme_service.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../auth/login_screen.dart';
import '../modules/fees_screen.dart';
import '../modules/exams_screen.dart';
import '../modules/attendance_screen.dart';
import '../modules/notification_screen.dart';
import '../modules/calendar_screen.dart';
import '../profile/user_profile.dart';

class ParentDashboard extends StatefulWidget {
  const ParentDashboard({super.key});

  @override
  State<ParentDashboard> createState() => _ParentDashboardState();
}

class _ParentDashboardState extends State<ParentDashboard> {
  bool _isLoading = true;
  double _dues = 0;
  List<dynamic> _children = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final stats = await ApiService.getDashboardStats();
      final students = await ApiService.getStudents();
      final fees = await ApiService.getFees();
      
      // Calculate real dues from fees collection
      double totalDues = 0;
      for (var f in fees) {
        bool isPaid = f['paid'] == true || f['status'] == 'paid';
        if (!isPaid) {
          totalDues += (f['amount'] ?? 0).toDouble();
        }
      }

      if (mounted) {
        setState(() {
          _dues = totalDues;
          _children = students.take(2).toList();
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
    final parentName = context.watch<AuthService>().name;
    
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: RefreshIndicator(
        onRefresh: _loadData,
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
                    colors: [Color(0xFFE11D48), Color(0xFF9F1239)],
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
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text("Parent Portal",
                                  style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                              const SizedBox(height: 4),
                              Text("Hello, ${parentName.split(' ')[0]}",
                                  style: const TextStyle(fontSize: 28, color: Colors.white, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Row(
                          children: [
                            IconButton(
                              onPressed: () => context.read<ThemeProvider>().toggleTheme(),
                              icon: Icon(isDark ? LucideIcons.sun : LucideIcons.moon, color: Colors.white),
                            ),
                            const SizedBox(width: 8),
                            GestureDetector(
                              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UserProfileScreen())),
                              child: const CircleAvatar(
                                radius: 26,
                                backgroundColor: Colors.white24,
                                child: Icon(LucideIcons.user, color: Colors.white, size: 20),
                              ),
                            ),
                            const SizedBox(width: 4),
                            IconButton(
                              onPressed: () {
                                context.read<AuthService>().logout();
                                Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginScreen()), (route) => false);
                              },
                              icon: const Icon(LucideIcons.logOut, color: Colors.white, size: 20),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    _isLoading 
                      ? const Center(child: CircularProgressIndicator(color: Colors.white))
                      : _buildStatsRow(),
                  ],
                ),
              ),
  
              const SizedBox(height: 32),
              
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Child Management",
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
                        _buildParentCard(context, "Fees Panel", "Clear Invoices", LucideIcons.creditCard, Colors.blue, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FeesScreen())).then((_) => _loadData())),
                        _buildParentCard(context, "Academic", "Check Grades", LucideIcons.lineChart, Colors.green, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ExamsScreen()))),
                        _buildParentCard(context, "Attendance", "Daily Logs", LucideIcons.checkCircle, Colors.orange, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AttendanceScreen()))),
                        _buildParentCard(context, "Notices", "School Updates", LucideIcons.megaphone, Colors.purple, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen()))),
                      ],
                    ),
                    
                    const SizedBox(height: 32),
                    Text("Student Profiles",
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                    const SizedBox(height: 16),
                    if (_children.isEmpty && !_isLoading)
                       const Center(child: Text("No children records linked yet")),
                    ..._children.map<Widget>((child) => _buildChildTile(
                      child['userId']?['name'] ?? child['name'] ?? "Student", 
                      "Grade ${child['class'] ?? 'N/A'}-${child['section'] ?? 'A'}", 
                      "ID: ${(child['_id'] ?? '...').toString().substring(0,6).toUpperCase()}", 
                      Colors.indigo
                    )),
                    
                    const SizedBox(height: 32),
                    // CALENDAR TILE
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.indigo.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(color: Colors.indigo.withOpacity(0.1)),
                      ),
                      child: ListTile(
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AcademicCalendarScreen())),
                        leading: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: Colors.indigo, borderRadius: BorderRadius.circular(16)),
                          child: const Icon(LucideIcons.calendar, color: Colors.white, size: 24),
                        ),
                        title: const Text("Institutional Calendar", style: TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: const Text("View exams, holidays & events"),
                        trailing: const Icon(LucideIcons.chevronRight),
                      ),
                    ),
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
          _statItem("Dues", "₹${_dues.toStringAsFixed(0)}"),
          Container(height: 30, width: 1, color: Colors.white10),
          _statItem("Children", _children.length.toString().padLeft(2, '0')),
          Container(height: 30, width: 1, color: Colors.white10),
          _statItem("Status", "Active"),
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

  Widget _buildParentCard(BuildContext context, String title, String sub, IconData icon, Color color, VoidCallback onTap) {
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

  Widget _buildChildTile(String name, String grade, String id, Color color) {
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
          CircleAvatar(
            backgroundColor: color.withOpacity(0.2),
            child: Text(name[0], style: TextStyle(color: color, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(grade, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
          Text(id, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 10)),
          const SizedBox(width: 8),
          const Icon(LucideIcons.chevronRight, size: 18, color: Colors.grey),
        ],
      ),
    );
  }
}
