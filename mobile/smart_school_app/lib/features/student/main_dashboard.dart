import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../services/theme_service.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../../core/constants/colors.dart';
import '../modules/attendance_screen.dart';
import '../modules/fees_screen.dart';
import '../modules/timetable_screen.dart';
import '../modules/exams_screen.dart';
import '../modules/transport_screen.dart';
import '../modules/homework_screen.dart';
import '../communication/communication_screen.dart';
import '../modules/notification_screen.dart';
import '../modules/calendar_screen.dart';
import '../profile/user_profile.dart';
import '../auth/login_screen.dart';

class MainDashboard extends StatefulWidget {
  const MainDashboard({super.key});

  @override
  State<MainDashboard> createState() => _MainDashboardState();
}

class _MainDashboardState extends State<MainDashboard> {
  bool _isLoading = true;
  double _attendance = 0;
  int _homeworkCount = 0;
  List<dynamic> _notices = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final stats = await ApiService.getDashboardStats();
      final homework = await ApiService.getHomework();
      final notices = await ApiService.getNotices();
      
      if (mounted) {
        setState(() {
          _attendance = (stats['attendancePercentage'] ?? 0).toDouble();
          _homeworkCount = homework.length;
          _notices = notices;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Connecting to School Help Desk..."), backgroundColor: AppColors.primary),
          );
        },
        backgroundColor: AppColors.primary,
        elevation: 10,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        label: const Text("Help Desk", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        icon: const Icon(LucideIcons.plus, color: Colors.white),
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            children: [
              // HEADER SECTION
              Container(
                padding: const EdgeInsets.fromLTRB(24, 60, 24, 40),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppColors.secondary, AppColors.primary],
                  ),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(50),
                    bottomRight: Radius.circular(50),
                  ),
                  boxShadow: [
                    BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, 10))
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("Smart School ERP",
                                style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                            const SizedBox(height: 4),
                            Text("Hello, ${context.watch<AuthService>().name.split(' ')[0]}",
                                style: const TextStyle(fontSize: 28, color: Colors.white, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Row(
                          children: [
                            IconButton(
                              onPressed: () => context.read<ThemeProvider>().toggleTheme(),
                              icon: Icon(
                                context.watch<ThemeProvider>().isDarkMode ? LucideIcons.sun : LucideIcons.moon,
                                color: Colors.white,
                                size: 22,
                              ),
                            ),
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
                    // STATS BAR
                    _isLoading 
                    ? const Center(child: CircularProgressIndicator(color: Colors.white))
                    : Container(
                        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(color: Colors.white.withOpacity(0.1)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _statItem("Attendance", "${_attendance.toStringAsFixed(0)}%"),
                            Container(height: 30, width: 1, color: Colors.white24),
                            _statItem("GPA", "3.8"),
                            Container(height: 30, width: 1, color: Colors.white24),
                            _statItem("Homework", _homeworkCount.toString().padLeft(2, '0')),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
    
              const SizedBox(height: 32),
    
              // MODULES GRID
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("School Modules", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                    const SizedBox(height: 16),
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 1.4,
                      children: [
                        _moduleCard(context, "Attendance", "Daily Log", LucideIcons.checkCircle, Colors.blue, const AttendanceScreen()),
                        _moduleCard(context, "Fees", "Payments", LucideIcons.wallet, Colors.purple, const FeesScreen()),
                        _moduleCard(context, "Timetable", "Class Schedule", LucideIcons.calendar, Colors.orange, const TimetableScreen()),
                        _moduleCard(context, "Exams", "Results", LucideIcons.award, Colors.green, const ExamsScreen()),
                        _moduleCard(context, "Homework", "Assignments", LucideIcons.penTool, Colors.pink, const HomeworkScreen()),
                        _moduleCard(context, "Transport", "Bus Route", LucideIcons.bus, Colors.lightBlue, const TransportScreen()),
                        _moduleCard(context, "Calendar", "Events", LucideIcons.calendarDays, Colors.teal, const AcademicCalendarScreen()),
                        _moduleCard(context, "Communicate", "Faculty", LucideIcons.messageSquare, Colors.indigo, const CommunicationScreen()),
                      ],
                    ),
                    const SizedBox(height: 32),
                    
                    // NOTICE BOARD
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Notice Board", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                        TextButton(
                          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => NotificationScreen())), 
                          child: const Text("View All", style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold))
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _isLoading 
                      ? const Center(child: CircularProgressIndicator())
                      : Container(
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(30),
                            border: Border.all(color: AppColors.border.withOpacity(0.5)),
                            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
                          ),
                          child: Column(
                            children: _notices.isEmpty 
                              ? [const Padding(padding: EdgeInsets.all(32), child: Center(child: Text("No announcements", style: TextStyle(color: Colors.grey))))]
                              : _notices.take(4).map<Widget>((n) => Column(
                                  children: [
                                    NoticeTile(
                                      n['title'] ?? "Announcement", 
                                      n['createdAt'] != null ? n['createdAt'].toString().substring(0,10) : "Just now", 
                                      n['priority'] == 'urgent' ? LucideIcons.alertTriangle : LucideIcons.bell, 
                                      n['priority'] == 'urgent' ? Colors.red : Colors.blue,
                                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => NotificationScreen())),
                                    ),
                                    if (n != _notices.take(4).last) const Divider(indent: 70, endIndent: 20, height: 1),
                                  ],
                                )).toList(),
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

  Widget _statItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        Text(label, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11)),
      ],
    );
  }

  Widget _moduleCard(BuildContext context, String title, String sub, IconData icon, Color color, Widget nextScreen) {
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => nextScreen)),
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
}

class NoticeTile extends StatelessWidget {
  final String title, time;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;
  const NoticeTile(this.title, this.time, this.icon, this.color, {this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
        child: Icon(icon, color: color, size: 24),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
      subtitle: Text(time, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      trailing: const Icon(LucideIcons.chevronRight, size: 18, color: Colors.grey),
    );
  }
}