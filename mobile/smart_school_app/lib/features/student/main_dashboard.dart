import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/theme_service.dart';
import '../../services/auth_service.dart';
import '../auth/login_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../modules/attendance_screen.dart';
import '../modules/fees_screen.dart';
import '../modules/timetable_screen.dart';
import '../modules/exams_screen.dart';
import '../modules/homework_screen.dart';
import '../modules/bus_screen.dart';
import '../modules/notification_screen.dart';
import '../modules/calendar_screen.dart';
import '../profile/user_profile.dart';

class MainDashboard extends StatelessWidget {
  const MainDashboard({super.key});

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
      body: SingleChildScrollView(
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
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 20,
                    offset: Offset(0, 10),
                  )
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
                          const SizedBox(width: 8),
                          GestureDetector(
                            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UserProfileScreen())),
                            child: const CircleAvatar(
                              radius: 28,
                              backgroundColor: Colors.white24,
                              child: Icon(LucideIcons.user, color: Colors.white, size: 24),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  // STATS BAR
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildHeaderStat("Attendance", "94%"),
                        Container(height: 30, width: 1, color: Colors.white10),
                        _buildHeaderStat("GPA", "3.8"),
                        Container(height: 30, width: 1, color: Colors.white10),
                        _buildHeaderStat("Rank", "#04"),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // MODULES SECTION
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("School Modules",
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                      IconButton(onPressed: () {}, icon: const Icon(LucideIcons.layoutGrid, color: AppColors.primary)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    childAspectRatio: 1,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    children: [
                      ModuleCard("Calendar", "Events & Holidays", LucideIcons.calendar, Colors.blue, 
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AcademicCalendarScreen()))),
                      ModuleCard("Fees", "Pay Invoices", LucideIcons.wallet, Colors.purple,
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FeesScreen()))),
                      ModuleCard("Timetable", "View schedule", LucideIcons.bookOpen, Colors.orange,
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TimetableScreen()))),
                      ModuleCard("Exams", "Grade reports", LucideIcons.award, Colors.green,
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ExamsScreen()))),
                      ModuleCard("Homework", "3 pending", LucideIcons.penTool, Colors.pink,
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const HomeworkScreen()))),
                      ModuleCard("Bus Track", "Live location", LucideIcons.bus, Colors.lightBlue,
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const BusScreen()))),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // UPCOMING EVENT CARD
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFF6D28D9), Color(0xFF7C3AED)]),
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: [
                        BoxShadow(color: const Color(0xFF6D28D9).withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.white10)),
                          child: Column(
                            children: const [
                              Text("24", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              Text("OCT", style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text("Maths Olympiad", style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Row(
                                children: const [
                                  Icon(LucideIcons.mapPin, color: Colors.white70, size: 12),
                                  SizedBox(width: 4),
                                  Text("Main Hall • 09:00 AM", style: TextStyle(color: Colors.white70, fontSize: 12)),
                                ],
                              ),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen())),
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                            child: const Icon(LucideIcons.bell, color: AppColors.primary, size: 18),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // NOTICE BOARD
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Notice Board", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                      TextButton(onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen())), child: const Text("View All", style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: AppColors.border.withOpacity(0.5)),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
                    ),
                    child: Column(
                      children: const [
                        NoticeTile("Annual Sports Meet 2024", "2 hours ago", LucideIcons.flag, Colors.red),
                        Divider(indent: 70, endIndent: 20, height: 1),
                        NoticeTile("Parent-Teacher Meeting", "Yesterday", LucideIcons.users, Colors.orange),
                        Divider(indent: 70, endIndent: 20, height: 1),
                        NoticeTile("Winter Vacation Schedule", "2 days ago", LucideIcons.snowflake, Colors.blue),
                        Divider(indent: 70, endIndent: 20, height: 1),
                        NoticeTile("Science Fair Registration", "1 week ago", LucideIcons.lightbulb, Colors.green),
                      ],
                    ),
                  ),
                  const SizedBox(height: 100), // Bottom padding
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderStat(String label, String value) {
    return Column(
      children: [
        Text(label, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
      ],
    );
  }
}

class ModuleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;
  const ModuleCard(this.title, this.subtitle, this.icon, this.color, {this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
              child: Icon(icon, color: color, size: 30),
            ),
            const SizedBox(height: 16),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
            const SizedBox(height: 4),
            Text(subtitle, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
          ],
        ),
      ),
    );
  }
}

class NoticeTile extends StatelessWidget {
  final String title;
  final String time;
  final IconData icon;
  final Color color;
  const NoticeTile(this.title, this.time, this.icon, this.color, {super.key});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(14)),
        child: Icon(icon, color: color, size: 20),
      ),
      title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textDark)),
      subtitle: Text(time, style: const TextStyle(fontSize: 11, color: AppColors.textLight)),
      trailing: const Icon(LucideIcons.chevronRight, size: 18, color: AppColors.textLight),
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen())),
    );
  }
}