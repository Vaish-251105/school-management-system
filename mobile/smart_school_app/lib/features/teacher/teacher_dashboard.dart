import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/theme_service.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../auth/login_screen.dart';
import 'attendance_screen.dart';
import 'homework_screen.dart';
import 'exam_results_screen.dart';
import '../communication/communication_screen.dart';
import '../modules/notification_screen.dart';
import '../modules/calendar_screen.dart';
import '../profile/user_profile.dart';

class TeacherDashboard extends StatefulWidget {
  const TeacherDashboard({super.key});

  @override
  State<TeacherDashboard> createState() => _TeacherDashboardState();
}

class _TeacherDashboardState extends State<TeacherDashboard> {
  bool _isLoading = true;
  int _studentCount = 0;
  int _classCount = 0;
  int _noticesCount = 0;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    if (!mounted) return;
    setState(() => _isLoading = true);
    try {
      final stats = await ApiService.getDashboardStats();
      if (mounted) {
        setState(() {
          _studentCount = stats['studentsCount'] ?? 0;
          _classCount = stats['classesCount'] ?? 0;
          _noticesCount = stats['noticesCount'] ?? 0;
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
    final teacherName = context.watch<AuthService>().name;
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;
    
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: RefreshIndicator(
        onRefresh: _loadStats,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            children: [
              // HEADER
              Container(
                padding: EdgeInsets.fromLTRB(isMobile ? 16 : 24, 60, isMobile ? 16 : 24, 40),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
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
                              const Text("Faculty Portal",
                                  style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                              const SizedBox(height: 4),
                              Text("Hello, ${teacherName.split(' ')[0]}",
                                  style: TextStyle(fontSize: isMobile ? 22 : 28, color: Colors.white, fontWeight: FontWeight.bold)),
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
                                child: Icon(LucideIcons.user, color: Colors.white, size: 22),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    _isLoading 
                      ? const Center(child: CircularProgressIndicator(color: Colors.white))
                      : _buildStatsRow(isMobile),
                  ],
                ),
              ),
  
              const SizedBox(height: 32),
              
              Padding(
                padding: EdgeInsets.symmetric(horizontal: isMobile ? 16 : 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Classroom Control",
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                    const SizedBox(height: 16),
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: isMobile ? 2 : 3,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 1.4,
                      children: [
                        _buildTeacherCard(context, "Mark Attendance", "Daily Presence", LucideIcons.checkSquare, Colors.green, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AttendanceScreen()))),
                        _buildTeacherCard(context, "Upload Homework", "Class Assignments", LucideIcons.bookOpen, Colors.orange, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const HomeworkScreen()))),
                        _buildTeacherCard(context, "Grade Exams", "Results Entry", LucideIcons.fileSpreadsheet, Colors.blue, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ExamResultsScreen()))),
                        _buildTeacherCard(context, "Staff Chat", "Internal Inbox", LucideIcons.messageCircle, Colors.purple, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CommunicationScreen()))),
                        _buildTeacherCard(context, "Notices", "Broadcasting", LucideIcons.megaphone, Colors.pink, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen()))),
                        _buildTeacherCard(context, "Academic Hub", "Institutional Calendar", LucideIcons.calendar, Colors.teal, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AcademicCalendarScreen()))),
                      ],
                    ),
                    
                    const SizedBox(height: 32),
                    Text("Teacher's Ledger",
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                    const SizedBox(height: 16),
                    _buildSessionTile("09:00 AM", "Subject: Advanced Maths", "Section: Grade 10-A", "Location: Room 302"),
                    _buildSessionTile("11:30 AM", "Subject: Physics Lab", "Section: Grade 12-B", "Location: Lab 04"),
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

  Widget _buildStatsRow(bool isMobile) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: isMobile ? 16 : 20, horizontal: isMobile ? 16 : 24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _statItem("Students", _studentCount.toString()),
          Container(height: 30, width: 1, color: Colors.white10),
          _statItem("Classes", _classCount.toString().padLeft(2, '0')),
          Container(height: 30, width: 1, color: Colors.white10),
          _statItem("Alerts", _noticesCount.toString().padLeft(2, '0')),
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

  Widget _buildTeacherCard(BuildContext context, String title, String sub, IconData icon, Color color, VoidCallback onTap) {
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

  Widget _buildSessionTile(String time, String subject, String grade, String room) {
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
          Text(time, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subject, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text("$grade • $room", style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
          const Icon(LucideIcons.chevronRight, size: 18, color: Colors.grey),
        ],
      ),
    );
  }
}
