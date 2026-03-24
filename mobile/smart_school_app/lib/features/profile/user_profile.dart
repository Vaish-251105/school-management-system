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
      body: Stack(
        children: [
          /// TOP BACKGROUND
          Container(
            height: 350,
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.secondary, AppColors.primary],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),

          /// APP BAR (Custom)
          Positioned(
            top: 60, left: 10, right: 10,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                   onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                    child: const Icon(LucideIcons.chevronLeft, color: Colors.white, size: 24),
                  ),
                ),
                const Text("Account Intelligence", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                  child: const Icon(LucideIcons.moreVertical, color: Colors.white, size: 24),
                ),
              ],
            ),
          ),

          /// MAIN CARD
          Positioned(
            top: 140,
            left: 20, right: 20, bottom: 0,
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 40),
              child: Column(
                children: [
                  /// PROFILE HEADER CARD
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))],
                    ),
                    child: Column(
                      children: [
                        Stack(
                          children: [
                            Container(
                              width: 100, height: 100,
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.white),
                              child: CircleAvatar(
                                backgroundColor: isDark ? Colors.white10 : Colors.grey.shade100,
                                backgroundImage: NetworkImage("https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=ffffff&size=128"),
                              ),
                            ),
                            Positioned(
                              bottom: 0, right: 0,
                              child: Container(
                                padding: const EdgeInsets.all(2),
                                decoration: BoxDecoration(color: theme.colorScheme.surface, shape: BoxShape.circle),
                                child: const Icon(LucideIcons.checkCircle, color: Colors.indigo, size: 24),
                              ),
                            )
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(user.name, textAlign: TextAlign.center, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(color: theme.primaryColor.withOpacity(0.1), borderRadius: BorderRadius.circular(20), border: Border.all(color: theme.primaryColor.withOpacity(0.05))),
                              child: Text(user.role.toUpperCase(), style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 0.8)),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(color: Colors.black, borderRadius: BorderRadius.circular(20)),
                              child: const Text("PRO VERSION", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 0.8)),
                            ),
                          ],
                        ),
                        
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 24),
                          child: Divider(color: theme.dividerColor.withOpacity(0.05), height: 1),
                        ),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _buildProfileStat(context, "ACTIVE", "Status"),
                            _buildProfileStat(context, "OCT 24", "Term"),
                            _buildProfileStat(context, "4.9", "Rating"),
                          ],
                        )
                      ],
                    ),
                  ),

                  const SizedBox(height: 30),

                  /// PERSONAL INFO
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Institutional Credentials", style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 0.4)),
                      const Text("SECURED", style: TextStyle(fontSize: 9, color: AppColors.textLight, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 16),

                  _buildInfoTile(context, LucideIcons.mail, "Institutional Email", user.email),
                  _buildInfoTile(context, LucideIcons.phone, "System Phone", "+1 (555) 0123-4567"),
                  _buildInfoTile(context, LucideIcons.shieldCheck, "Security Tier", "Access Level: ${user.role}"),
                  _buildInfoTile(context, LucideIcons.badgeCheck, "Database UID", user.userId),

                  const SizedBox(height: 30),

                  /// BUTTONS
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("ID Synchronized to Secure Wallet"))),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                        elevation: 10, shadowColor: AppColors.primary.withOpacity(0.4)
                      ),
                      icon: const Icon(LucideIcons.qrCode, color: Colors.white),
                      label: const Text("Generate Digital ID", style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () {
                         context.read<AuthService>().logout();
                         Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginScreen()), (route) => false);
                      },
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.redAccent, width: 1.5),
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                      ),
                      icon: const Icon(LucideIcons.logOut, color: Colors.redAccent, size: 20),
                      label: const Text("Terminate Session", style: TextStyle(color: Colors.redAccent, fontSize: 14, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileStat(BuildContext context, String val, String label) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      children: [
        Text(val, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: isDark ? Colors.white : AppColors.textDark)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
      ],
    );
  }

  Widget _buildInfoTile(BuildContext context, IconData icon, String title, String val) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: theme.dividerColor.withOpacity(0.03)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: theme.primaryColor.withOpacity(0.08), shape: BoxShape.circle),
            child: Icon(icon, color: theme.primaryColor, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: AppColors.textLight, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.2)),
                const SizedBox(height: 2),
                Text(val, style: TextStyle(color: isDark ? Colors.white : AppColors.textDark, fontSize: 14, fontWeight: FontWeight.w600)),
              ],
            ),
          )
        ],
      ),
    );
  }
}
