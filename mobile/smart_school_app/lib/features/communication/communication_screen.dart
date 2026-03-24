import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class CommunicationScreen extends StatefulWidget {
  const CommunicationScreen({super.key});

  @override
  State<CommunicationScreen> createState() => _CommunicationScreenState();
}

class _CommunicationScreenState extends State<CommunicationScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _inboxMessages = [];
  List<dynamic> _sentMessages = [];
  bool _isLoading = false;
  int _unreadCount = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadMessages();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadMessages() async {
    setState(() => _isLoading = true);
    try {
      final inbox = await ApiService.getInbox();
      final sent = await ApiService.getSentMessages();
      final unread = await ApiService.getUnreadCount();

      if (mounted) {
        setState(() {
          _inboxMessages = inbox is List ? inbox : [];
          _sentMessages = sent is List ? sent : [];
          _unreadCount = (unread is Map && unread['unreadCount'] != null) ? unread['unreadCount'] : 0;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error loading messages: $e"), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _showComposeDialog() {
    final subjectController = TextEditingController();
    final messageController = TextEditingController();
    String? selectedRecipient;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("New Message"),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                value: selectedRecipient,
                decoration: const InputDecoration(labelText: "Send to", border: OutlineInputBorder()),
                items: [
                  const DropdownMenuItem(value: null, child: Text("Select recipient")),
                  const DropdownMenuItem(value: "teacher1", child: Text("Dr. Sarah Jenkins")),
                  const DropdownMenuItem(value: "teacher2", child: Text("Prof. Michael Chen")),
                  const DropdownMenuItem(value: "principal", child: Text("Principal")),
                ].toList(),
                onChanged: (value) => selectedRecipient = value,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: subjectController,
                decoration: const InputDecoration(labelText: "Subject", border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: messageController,
                maxLines: 4,
                decoration: const InputDecoration(labelText: "Message", border: OutlineInputBorder()),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (subjectController.text.isEmpty || messageController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Please fill all fields"), backgroundColor: Colors.orange),
                );
                return;
              }

              try {
                await ApiService.sendMessage(selectedRecipient ?? "", subjectController.text, messageController.text);
                Navigator.pop(context);
                _loadMessages();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Message sent successfully!"), backgroundColor: Colors.green),
                );
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Error: $e"), backgroundColor: Colors.red),
                );
              }
            },
            child: const Text("Send"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft)),
        title: const Text("Communication", style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.transparent,
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(LucideIcons.inbox),
                  const SizedBox(width: 8),
                  const Text("Inbox"),
                  if (_unreadCount > 0)
                    Container(
                      margin: const EdgeInsets.only(left: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(10)),
                      child: Text(_unreadCount.toString(), style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                ],
              ),
            ),
            const Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(LucideIcons.send),
                  SizedBox(width: 8),
                  Text("Sent"),
                ],
              ),
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildInbox(),
                _buildSent(),
              ],
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showComposeDialog,
        backgroundColor: AppColors.primary,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text("Compose", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildInbox() {
    if (_inboxMessages.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.inbox, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text("No messages", style: TextStyle(color: Colors.grey[600], fontSize: 16)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _inboxMessages.length,
      itemBuilder: (context, index) {
        final message = _inboxMessages[index];
        return _buildMessageCard(message, isInbox: true);
      },
    );
  }

  Widget _buildSent() {
    if (_sentMessages.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.send, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text("No sent messages", style: TextStyle(color: Colors.grey[600], fontSize: 16)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _sentMessages.length,
      itemBuilder: (context, index) {
        final message = _sentMessages[index];
        return _buildMessageCard(message, isInbox: false);
      },
    );
  }

  Widget _buildMessageCard(dynamic message, {required bool isInbox}) {
    final theme = Theme.of(context);
    final senderName = isInbox ? (message['sender']?['name'] ?? "Unknown") : (message['recipient']?['name'] ?? "Unknown");
    final subject = message['subject'] ?? "No subject";
    final messageText = message['message'] ?? "";
    final timestamp = message['timestamp'] ?? message['createdAt'] ?? "";
    final isRead = message['isRead'] ?? false;

    return GestureDetector(
      onTap: () => _showMessageDetail(message),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: theme.dividerColor.withOpacity(0.05)),
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
                      Text(
                        senderName,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subject,
                        style: TextStyle(
                          color: isRead ? AppColors.textLight : AppColors.primary,
                          fontSize: 14,
                          fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                if (isInbox && !isRead)
                  Container(
                    width: 12,
                    height: 12,
                    decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              messageText,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: AppColors.textLight, fontSize: 13),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _formatTime(timestamp),
                  style: const TextStyle(color: AppColors.textLight, fontSize: 11),
                ),
                if (isInbox)
                  IconButton(
                    onPressed: () async {
                      await ApiService.deleteMessage(message['_id'] ?? "");
                      _loadMessages();
                    },
                    icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.red),
                    padding: EdgeInsets.zero,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showMessageDetail(dynamic message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(message['subject'] ?? "Message"),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("From: ${message['sender']?['name'] ?? 'Unknown'}", style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              Text(message['message'] ?? "", style: const TextStyle(height: 1.5)),
              const SizedBox(height: 16),
              Text(_formatTime(message['timestamp'] ?? message['createdAt'] ?? ""), style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Close")),
        ],
      ),
    );
  }

  String _formatTime(String timestamp) {
    if (timestamp.isEmpty) return "Just now";
    try {
      final date = DateTime.parse(timestamp);
      final now = DateTime.now();
      final diff = now.difference(date);

      if (diff.inMinutes < 1) return "Just now";
      if (diff.inMinutes < 60) return "${diff.inMinutes}m ago";
      if (diff.inHours < 24) return "${diff.inHours}h ago";
      if (diff.inDays < 7) return "${diff.inDays}d ago";
      return "${date.day}/${date.month}/${date.year}";
    } catch (e) {
      return "Unknown";
    }
  }
}
