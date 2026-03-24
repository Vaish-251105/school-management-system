import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/theme_service.dart';
import '../../services/auth_service.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../academic/classes_subjects.dart';
import '../staff/staff_directory.dart';
import '../../services/api_service.dart';
import '../auth/login_screen.dart';
import '../modules/notification_screen.dart';
import '../modules/calendar_screen.dart';
import '../profile/user_profile.dart';
import '../modules/fees_screen.dart';
import './analytics_screen.dart';
import 'staff_attendance.dart';
import '../student/student_directory.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  int teacherCount = 0;
  int classCount = 0;
  int studentCount = 0;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchStats();
  }

  Future<void> _fetchStats() async {
    try {
      final stats = await ApiService.getDashboardStats();
      if (mounted) {
        setState(() {
          teacherCount = stats['teachersCount'] ?? 0;
          classCount = stats['classesCount'] ?? 0;
          studentCount = stats['studentsCount'] ?? 0;
          isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isAdminDark = context.watch<ThemeProvider>().isDarkMode;
    final adminName = context.watch<AuthService>().name;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StaffDirectoryScreen())),
        backgroundColor: AppColors.primary,
        elevation: 10,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        label: const Text("Add Staff", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        icon: const Icon(LucideIcons.plus, color: Colors.white),
      ),
      body: RefreshIndicator(
        onRefresh: _fetchStats,
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
                    colors: [AppColors.secondary, AppColors.primary],
                  ),
                  borderRadius: BorderRadius.only(bottomLeft: Radius.circular(50), bottomRight: Radius.circular(50)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Smart Admin Panel",
                                  style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                              const SizedBox(height: 4),
                              Text("Hello, ${adminName.split(' ')[0]}",
                                  style: const TextStyle(fontSize: 28, color: Colors.white, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Row(
                          children: [
                            IconButton(
                              onPressed: () => context.read<ThemeProvider>().toggleTheme(),
                              icon: Icon(
                                isAdminDark ? LucideIcons.sun : LucideIcons.moon,
                                color: Colors.white,
                                size: 22,
                              ),
                            ),
                            IconButton(
                              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UserProfileScreen())),
                              icon: const Icon(LucideIcons.user, color: Colors.white, size: 24),
                            ),
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
                    GestureDetector(
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StaffDirectoryScreen())),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.white.withOpacity(0.1)),
                        ),
                        child: Row(
                          children: [
                            const Icon(LucideIcons.search, color: Colors.white70, size: 18),
                            const SizedBox(width: 12),
                            Text("Search teachers, students, staff...", style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 14)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    isLoading 
                      ? const Center(child: CircularProgressIndicator(color: Colors.white))
                      : Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildHeaderStat("Staff", teacherCount.toString(), LucideIcons.users),
                          _buildHeaderStat("Classes", classCount.toString(), LucideIcons.layers),
                          _buildHeaderStat("Students", studentCount.toString(), LucideIcons.graduationCap),
                        ],
                      )
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // MAIN GRID
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Management Tools",
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Theme.of(context).textTheme.headlineSmall?.color)),
                    const SizedBox(height: 16),
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      childAspectRatio: 1.1,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      children: [
                        AdminCard("Staff List", "New faculty", LucideIcons.userPlus, Colors.blue, 
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StaffDirectoryScreen()))),
                        AdminCard("Staff Attendance", "Mark/View", LucideIcons.userCheck, Colors.indigo, 
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StaffAttendanceScreen()))),
                        AdminCard("Classes", "Manage sections", LucideIcons.layout, Colors.purple,
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ClassesSubjectsScreen()))),
                        AdminCard("Announce", "Bulk updates", LucideIcons.megaphone, Colors.orange, 
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen()))),
                        AdminCard("Analytics", "Growth reports", LucideIcons.barChart3, Colors.green, 
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AnalyticsScreen()))),
                         AdminCard("Fees Status", "Audit dues", LucideIcons.wallet, Colors.teal, 
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FeesScreen()))),
                        AdminCard("Calendar", "Events", LucideIcons.calendar, Colors.amber, 
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AcademicCalendarScreen()))),
                         AdminCard("Students", "Roster", LucideIcons.graduationCap, Colors.pink, 
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentDirectoryScreen()))),
                      ],
                    ),
                    
                    const SizedBox(height: 32),

                    // BROADCAST CARD
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(colors: [Color(0xFF1E293B), Color(0xFF334155)]),
                        borderRadius: BorderRadius.circular(30),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 15, offset: const Offset(0, 8))
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(16)),
                            child: const Icon(LucideIcons.zap, color: Colors.yellow, size: 28),
                          ),
                          const SizedBox(width: 20),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text("Smart Portal", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                                SizedBox(height: 4),
                                Text("Complete oversight of all institutional modules in real-time.", style: TextStyle(color: Colors.white60, fontSize: 13)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderStat(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.white10)),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 20),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          Text(label, style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class AdminCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;
  const AdminCard(this.title, this.subtitle, this.icon, this.color, {this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: theme.dividerColor.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
              child: Icon(icon, color: color, size: 26),
            ),
            const SizedBox(height: 16),
            Text(title, textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: isDark ? Colors.white : AppColors.textDark)),
            const SizedBox(height: 4),
            Text(subtitle, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
          ],
        ),
      ),
    );
  }
}