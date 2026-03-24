import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  List<dynamic> notifications = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchNotifications();
  }

  Future<void> fetchNotifications() async {
    try {
      final res = await ApiService.getNotices();
      setState(() {
        notifications = res;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthService>();
    bool canAdd = user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'teacher';

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text("Notifications", style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : notifications.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: fetchNotifications,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    itemCount: notifications.length,
                    itemBuilder: (context, index) {
                      final n = notifications[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Theme.of(context).cardColor,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))
                          ],
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
                              child: const Icon(LucideIcons.bell, color: AppColors.primary, size: 24),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(n['title'] ?? "Notification", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                  const SizedBox(height: 6),
                                  Text(n['content'] ?? "", style: TextStyle(color: AppColors.textLight.withOpacity(0.8), fontSize: 14)),
                                  const SizedBox(height: 12),
                                  Text(n['createdAt'] != null ? n['createdAt'].toString().substring(0, 10) : "", 
                                       style: const TextStyle(color: AppColors.textLight, fontSize: 11, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
      floatingActionButton: canAdd 
          ? FloatingActionButton(
              onPressed: _showAddNoticeDialog,
              backgroundColor: AppColors.primary,
              child: const Icon(LucideIcons.plus, color: Colors.white),
            )
          : null,
    );
  }

  void _showAddNoticeDialog() {
    final titleController = TextEditingController();
    final contentController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Create New Notice"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleController, decoration: const InputDecoration(labelText: "Title")),
            TextField(controller: contentController, decoration: const InputDecoration(labelText: "Content"), maxLines: 3),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (titleController.text.isNotEmpty) {
                await ApiService.createNotice({
                  "title": titleController.text,
                  "content": contentController.text,
                });
                Navigator.pop(context);
                fetchNotifications();
              }
            }, 
            child: const Text("Post")
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(color: AppColors.surface, shape: BoxShape.circle),
            child: Icon(LucideIcons.bellOff, size: 64, color: AppColors.textLight.withOpacity(0.3)),
          ),
          const SizedBox(height: 24),
          const Text("No Notifications", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark)),
          const SizedBox(height: 8),
          const Text("You're all caught up! New updates will appear here.", style: TextStyle(color: AppColors.textLight)),
        ],
      ),
    );
  }
}

class NoticeTile extends StatelessWidget {
  final String title;
  final String date;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const NoticeTile(this.title, this.date, this.icon, this.color, {required this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: color, size: 18),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textDark)),
      subtitle: Text(date, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
      trailing: const Icon(LucideIcons.chevronRight, size: 14, color: AppColors.textLight),
      onTap: onTap,
    );
  }
}
