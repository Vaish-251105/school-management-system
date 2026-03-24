import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../services/auth_service.dart';
import '../auth/login_screen.dart';

class UserProfileScreen extends StatelessWidget {
  const UserProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final user = context.watch<AuthService>();

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            expandedHeight: 320,
            pinned: true,
            stretch: true,
            backgroundColor: AppColors.primary,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              stretchModes: const [StretchMode.zoomBackground, StretchMode.blurBackground],
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.secondary, AppColors.primary],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    Stack(
                      children: [
                        Container(
                          width: 110,
                          height: 110,
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.white24),
                          child: CircleAvatar(
                            radius: 50,
                            backgroundImage: NetworkImage("https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=ffffff&size=128"),
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle),
                            child: const Icon(LucideIcons.check, color: Colors.white, size: 16),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      user.name,
                      style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      user.role.toUpperCase(),
                      style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildHeaderStat("OCT 24", "Current Term"),
                      _buildHeaderStat("ACTIVE", "Status"),
                      _buildHeaderStat("PRO", "Account"),
                    ],
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    "INSTITUTIONAL INFORMATION",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textLight, letterSpacing: 1.1),
                  ),
                  const SizedBox(height: 16),
                  _buildDetailTile(context, LucideIcons.mail, "Official Email", user.email),
                  _buildDetailTile(context, LucideIcons.user, "Role Profile", user.role.toUpperCase()),
                  
                  if (user.role == 'student') ...[
                    _buildDetailTile(context, LucideIcons.hash, "Roll Number", "#${user.details['rollNumber'] ?? 'N/A'}"),
                    _buildDetailTile(context, LucideIcons.book, "Current Class", "Grade ${user.details['class'] ?? 'N/A'} - ${user.details['section'] ?? 'A'}"),
                  ],
                  if (user.role == 'teacher') ...[
                    _buildDetailTile(context, LucideIcons.award, "Designation", user.details['subject'] ?? 'Senior Faculty'),
                    _buildDetailTile(context, LucideIcons.briefcase, "Experience", "${user.details['experience'] ?? 0} Years"),
                  ],

                  _buildDetailTile(context, LucideIcons.calendar, "Registered date", "Sep 2024"),
                  _buildDetailTile(context, LucideIcons.shieldCheck, "Database ID", user.id),

                  const SizedBox(height: 32),
                  const Text(
                    "ACCOUNT ACTIONS",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textLight, letterSpacing: 1.1),
                  ),
                  const SizedBox(height: 16),
                  
                  _buildActionBtn(
                    context, 
                    "Update Security Credentials", 
                    LucideIcons.lock, 
                    Colors.blue,
                    () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Security settings are managed by Admin")))
                  ),
                   _buildActionBtn(
                    context, 
                    "Export Digital Identity", 
                    LucideIcons.download, 
                    Colors.green,
                    () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Digital ID generated successfully")))
                  ),
                   _buildActionBtn(
                    context, 
                    "Terminate All Sessions", 
                    LucideIcons.logOut, 
                    Colors.redAccent,
                    () {
                       context.read<AuthService>().logout();
                       Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginScreen()), (route) => false);
                    }
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildHeaderStat(String val, String label) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 10, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildDetailTile(BuildContext context, IconData icon, String title, String value) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.05) : Colors.grey.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? Colors.white.withOpacity(0.03) : Colors.black.withOpacity(0.03)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
            child: Icon(icon, color: AppColors.primary, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 10, color: AppColors.textLight, fontWeight: FontWeight.bold)),
                const SizedBox(height: 2),
                Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildActionBtn(BuildContext context, String title, IconData icon, Color color, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        onTap: onTap,
        tileColor: color.withOpacity(0.05),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        leading: Icon(icon, color: color),
        title: Text(title, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 14)),
        trailing: Icon(Icons.chevron_right, color: color),
      ),
    );
  }
}
