import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class HomeworkScreen extends StatefulWidget {
  const HomeworkScreen({super.key});

  @override
  State<HomeworkScreen> createState() => _HomeworkScreenState();
}

class _HomeworkScreenState extends State<HomeworkScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _allHomework = [];
  List<dynamic> _submittedHomework = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadHomework();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadHomework() async {
    setState(() => _isLoading = true);
    try {
      final homework = await ApiService.getHomework();
      if (mounted) {
        setState(() {
          _allHomework = homework is List ? homework : [];
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e"), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _showAddHomeworkDialog() {
    final subjectController = TextEditingController();
    final descriptionController = TextEditingController();
    DateTime? dueDate;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text("Create Homework"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: subjectController,
                  decoration: const InputDecoration(labelText: "Subject", border: OutlineInputBorder()),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: descriptionController,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: "Description", border: OutlineInputBorder()),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        dueDate == null ? "Select due date" : DateFormat('dd MMM').format(dueDate!),
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now().add(const Duration(days: 7)),
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 30)),
                        );
                        if (date != null) setState(() => dueDate = date);
                      },
                      icon: const Icon(LucideIcons.calendar),
                      label: const Text("Pick Date"),
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
            ElevatedButton(
              onPressed: () async {
                if (subjectController.text.isEmpty || descriptionController.text.isEmpty || dueDate == null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Fill all fields")),
                  );
                  return;
                }

                try {
                  await ApiService.post("homework", {
                    "subject": subjectController.text,
                    "description": descriptionController.text,
                    "dueDate": dueDate?.toIso8601String(),
                  });
                  Navigator.pop(context);
                  _loadHomework();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Homework created!"), backgroundColor: Colors.green),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Error: $e"), backgroundColor: Colors.red),
                  );
                }
              },
              child: const Text("Create"),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft)),
        title: const Text("Homework", style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.transparent,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(LucideIcons.bookOpen), SizedBox(width: 8), Text("Assigned")])),
            Tab(child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(LucideIcons.check), SizedBox(width: 8), Text("Submitted")])),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [_buildAssignedTab(isMobile), _buildSubmittedTab(isMobile)],
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddHomeworkDialog,
        backgroundColor: AppColors.primary,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text("New", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildAssignedTab(bool isMobile) {
    if (_allHomework.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.bookOpen, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text("No homework assigned", style: TextStyle(color: Colors.grey[600], fontSize: 16)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(isMobile ? 12 : 16),
      itemCount: _allHomework.length,
      itemBuilder: (context, index) => _buildHomeworkCard(_allHomework[index]),
    );
  }

  Widget _buildSubmittedTab(bool isMobile) {
    if (_submittedHomework.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.check, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text("No submitted homework", style: TextStyle(color: Colors.grey[600], fontSize: 16)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _submittedHomework.length,
      itemBuilder: (context, index) => _buildHomeworkCard(_submittedHomework[index]),
    );
  }

  Widget _buildHomeworkCard(dynamic homework) {
    final subject = homework['subject'] ?? "Homework";
    final description = homework['description'] ?? "";
    final dueDate = homework['dueDate'] ?? homework['createdAt'];
    final id = homework['_id'] ?? "";

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: InkWell(
        onTap: () => _showDetailDialog(homework),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      subject,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  PopupMenuButton(
                    itemBuilder: (context) => [
                      PopupMenuItem(
                        child: const Text("View"),
                        onTap: () => _showDetailDialog(homework),
                      ),
                      PopupMenuItem(
                        child: const Text("Edit"),
                        onTap: () => _showEditDialog(homework),
                      ),
                      PopupMenuItem(
                        child: const Text("Delete"),
                        onTap: () => _deleteHomework(id),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: AppColors.textLight, fontSize: 13, height: 1.5),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(LucideIcons.calendar, size: 14, color: AppColors.primary),
                  const SizedBox(width: 6),
                  Text(
                    _formatDate(dueDate),
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDetailDialog(dynamic homework) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(homework['subject'] ?? "Homework"),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text("Description", style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text(homework['description'] ?? "", style: const TextStyle(height: 1.5)),
              const SizedBox(height: 16),
              Row(
                children: [
                  Icon(LucideIcons.calendar, size: 16, color: AppColors.primary),
                  const SizedBox(width: 8),
                  Text(
                    "Due: ${_formatDate(homework['dueDate'] ?? homework['createdAt'])}",
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Close")),
        ],
      ),
    );
  }

  void _showEditDialog(dynamic homework) {
    final subjectController = TextEditingController(text: homework['subject']);
    final descriptionController = TextEditingController(text: homework['description']);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Edit Homework"),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: subjectController, decoration: const InputDecoration(labelText: "Subject", border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(controller: descriptionController, maxLines: 3, decoration: const InputDecoration(labelText: "Description", border: OutlineInputBorder())),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              try {
                await ApiService.put("homework/${homework['_id']}", {
                  "subject": subjectController.text,
                  "description": descriptionController.text,
                });
                Navigator.pop(context);
                _loadHomework();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Updated!"), backgroundColor: Colors.green),
                );
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Error: $e"), backgroundColor: Colors.red),
                );
              }
            },
            child: const Text("Update"),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteHomework(String id) async {
    try {
      await ApiService.delete("homework/$id");
      _loadHomework();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Deleted!"), backgroundColor: Colors.green),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e"), backgroundColor: Colors.red),
      );
    }
  }

  String _formatDate(dynamic dateStr) {
    try {
      if (dateStr is String && dateStr.isNotEmpty) {
        final date = DateTime.parse(dateStr);
        return DateFormat('dd MMM yyyy').format(date);
      }
    } catch (e) {
      //
    }
    return "Unknown";
  }
}
