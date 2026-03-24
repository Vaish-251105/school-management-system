import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../services/api_service.dart';

class StaffProfileScreen extends StatefulWidget {
  final dynamic staff;
  const StaffProfileScreen({super.key, this.staff});

  @override
  State<StaffProfileScreen> createState() => _StaffProfileScreenState();
}

class _StaffProfileScreenState extends State<StaffProfileScreen> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final staff = widget.staff ?? {};
    final user = staff['userId'] ?? {};
    final name = user['name'] ?? "Staff Member";
    final role = user['role']?.toString().toUpperCase() ?? "STAFF";
    final email = user['email'] ?? "N/A";
    final subject = staff['subject'] ?? "General";
    final exp = staff['experience']?.toString() ?? "N/A";

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
            top: 60, left: 20, right: 20,
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
                const Text("Staff Profile", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                IconButton(
                  onPressed: () => _confirmDelete(),
                  icon: const Icon(LucideIcons.trash2, color: Colors.white, size: 24),
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
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: theme.dividerColor.withOpacity(0.05)),
                    ),
                    child: Column(
                      children: [
                        Stack(
                          children: [
                            Container(
                              width: 100, height: 100,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isDark ? Colors.white10 : Colors.grey.shade100,
                                border: Border.all(color: theme.colorScheme.surface, width: 4),
                              ),
                              child: Center(child: Text(name[0], style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold))),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(name, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(color: theme.primaryColor.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                              child: Text(role, style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold, fontSize: 12)),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(color: isDark ? Colors.white10 : Colors.grey.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                              child: Text(subject, style: TextStyle(color: isDark ? Colors.white70 : AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 12)),
                            ),
                          ],
                        ),
                        
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 24),
                          child: Divider(color: theme.dividerColor.withOpacity(0.1), height: 1),
                        ),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _buildProfileStat(context, "N/A", "Classes"),
                            _buildProfileStat(context, exp, "Years Exp"),
                            _buildProfileStat(context, "5.0", "Rating"),
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
                      Text("Personal Information", style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold, fontSize: 15)),
                      GestureDetector(
                        onTap: _showEditDialog,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: isDark ? Colors.white10 : Colors.grey.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                          child: Text("EDIT", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : AppColors.textDark)),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),

                  _buildInfoTile(context, LucideIcons.mail, "Institutional Email", email),
                  _buildInfoTile(context, LucideIcons.phone, "Contact Number", "+1 (555) 000-0000"),
                  _buildInfoTile(context, LucideIcons.book, "Primary Department", subject),
                  _buildInfoTile(context, LucideIcons.badgeCheck, "Employee ID", (staff['_id'] ?? '...').toString().substring(0,8).toUpperCase()),

                  const SizedBox(height: 30),

                  /// BUTTONS
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      ),
                      icon: const Icon(LucideIcons.qrCode, color: Colors.white),
                      label: const Text("Generate Digital ID", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
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

  void _showEditDialog() {
    final staff = widget.staff ?? {};
    final user = staff['userId'] ?? {};
    final nameController = TextEditingController(text: user['name'] ?? "");
    final subjectController = TextEditingController(text: staff['subject'] ?? "");
    final expController = TextEditingController(text: staff['experience']?.toString() ?? "");

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Edit Staff Profile"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameController, decoration: const InputDecoration(labelText: "Name")),
            TextField(controller: subjectController, decoration: const InputDecoration(labelText: "Subject/Dept")),
            TextField(controller: expController, decoration: const InputDecoration(labelText: "Experience (Years)"), keyboardType: TextInputType.number),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              final id = staff['_id'];
              if (id != null) {
                await ApiService.updateTeacher(id, {
                  "name": nameController.text,
                  "subject": subjectController.text,
                  "experience": int.tryParse(expController.text) ?? 0,
                });
                Navigator.pop(context);
                Navigator.pop(context); // Refresh directory
              }
            }, 
            child: const Text("Save Changes")
          ),
        ],
      ),
    );
  }

  void _confirmDelete() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Delete Staff"),
        content: const Text("Are you sure you want to delete this staff member? This will also delete their user account."),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              final id = widget.staff?['_id'];
              if (id != null) {
                await ApiService.deleteTeacher(id);
                Navigator.pop(context); // Close dialog
                Navigator.pop(context); // Back to directory
              }
            }, 
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text("Delete", style: TextStyle(color: Colors.white))
          ),
        ],
      ),
    );
  }

  Widget _buildProfileStat(BuildContext context, String val, String label) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      children: [
        Text(val, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: isDark ? Colors.white : AppColors.textDark)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 11, fontWeight: FontWeight.bold)),
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
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: theme.primaryColor.withOpacity(0.1), shape: BoxShape.circle),
            child: Icon(icon, color: theme.primaryColor, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: AppColors.textLight, fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 2),
                Text(val, style: TextStyle(color: isDark ? Colors.white : AppColors.textDark, fontSize: 14)),
              ],
            ),
          )
        ],
      ),
    );
  }
}
