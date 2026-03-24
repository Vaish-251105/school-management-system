import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/theme_service.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../auth/login_screen.dart';
import '../modules/attendance_screen.dart';
import '../modules/homework_screen.dart';
import '../modules/exams_screen.dart';
import '../communication/communication_screen.dart';
import '../modules/notification_screen.dart';
import '../modules/calendar_screen.dart';
import '../profile/user_profile.dart';
import 'exam_schedule.dart';
import '../modules/fees_screen.dart';

class TeacherDashboard extends StatefulWidget {
  const TeacherDashboard({super.key});

  @override
  State<TeacherDashboard> createState() => _TeacherDashboardState();
}

class _TeacherDashboardState extends State<TeacherDashboard> {
  bool _isLoading = true;
  String _selectedClass = "10";
  List<dynamic> _timetable = [];

  final List<String> _classes = ["8", "9", "10", "11", "12"];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final tts = await ApiService.getTimetableByClass(_selectedClass);
      if (mounted) {
        setState(() {
          _timetable = tts.isNotEmpty ? tts[0]['periods'] : [];
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
    final user = context.watch<AuthService>();
    final isMobile = MediaQuery.of(context).size.width < 600;

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
                    colors: [Color(0xFF4F46E5), Color(0xFF312E81)],
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
                            const Text("Faculty Portal",
                                style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                            const SizedBox(height: 4),
                            Text("Hi, ${user.name.split(' ')[0]}",
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
                               onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UserProfileScreen())),
                              child: CircleAvatar(
                                radius: 26,
                                backgroundColor: Colors.white24,
                                child: Text("${user.name[0]}", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                              ),
                            ),
                            const SizedBox(width: 8),
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
                  ],
                ),
              ),
    
              const SizedBox(height: 32),
              
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
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
                        _buildTeacherCard(context, "Attendance", "Daily Logs", LucideIcons.checkSquare, Colors.green, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AttendanceScreen()))),
                        _buildTeacherCard(context, "Assignments", "Upload Work", LucideIcons.bookOpen, Colors.orange, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const HomeworkScreen()))),
                        _buildTeacherCard(context, "Exam Results", "Entry", LucideIcons.fileSpreadsheet, Colors.blue, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ExamsScreen()))),
                        _buildTeacherCard(context, "Exam Schedule", "Plan Tests", LucideIcons.calendarClock, Colors.indigo, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ExamScheduleScreen()))),
                        _buildTeacherCard(context, "Messaging", "Inbox", LucideIcons.messageCircle, Colors.purple, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CommunicationScreen()))),
                        _buildTeacherCard(context, "Notices", "Broadcast", LucideIcons.megaphone, Colors.pink, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen()))),
                        _buildTeacherCard(context, "Student Fees", "Status", LucideIcons.wallet, Colors.teal, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FeesScreen()))),
                         _buildTeacherCard(context, "Calendar", "Events", LucideIcons.calendar, Colors.amber, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AcademicCalendarScreen()))),
                      ],
                    ),
                    
                    const SizedBox(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Class Schedule",
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                        DropdownButton<String>(
                          value: _selectedClass,
                          items: _classes.map((c) => DropdownMenuItem(value: c, child: Text("Grade $c"))).toList(),
                          onChanged: (val) {
                            if (val != null) {
                              setState(() => _selectedClass = val);
                              _loadData();
                            }
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _isLoading 
                      ? const Center(child: CircularProgressIndicator())
                      : _timetable.isEmpty 
                        ? const Center(child: Padding(padding: EdgeInsets.all(40), child: Text("No schedule for this class today", style: TextStyle(color: Colors.grey))))
                        : Column(
                            children: _timetable.map<Widget>((p) => _buildSessionTile(
                              p['startTime'] ?? "--", 
                              "Subject: ${p['subject'] ?? 'Unassigned'}", 
                              "Location: ${p['room'] ?? 'General Hall'}"
                            )).toList(),
                          ),
                  ],
                ),
              ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Exporting full schedule to PDF..."))),
        backgroundColor: const Color(0xFF312E81),
        label: const Text("Download PDF", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        icon: const Icon(LucideIcons.download, color: Colors.white),
      ),
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
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            Text(sub, style: TextStyle(color: Colors.grey.shade500, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  Widget _buildSessionTile(String time, String subject, String location) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
            decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
            child: Text(time, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF475569), fontSize: 12)),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subject, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(location, style: const TextStyle(fontSize: 12, color: Colors.indigo, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
