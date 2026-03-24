import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class HomeworkScreen extends StatefulWidget {
  const HomeworkScreen({super.key});

  @override
  State<HomeworkScreen> createState() => _HomeworkScreenState();
}

class _HomeworkScreenState extends State<HomeworkScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _homeworks = [];
  List<dynamic> _notices = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _fetchData() async {
    await Future.wait([
      _fetchHomework(),
      _fetchNotices(),
    ]);
  }

  Future<void> _deleteHomework(String id) async {
    await ApiService.deleteHomework(id);
    _fetchHomework();
  }

  Future<void> _deleteNotice(String id) async {
    await ApiService.deleteNotice(id);
    _fetchNotices();
  }

  Future<void> _fetchHomework() async {
    setState(() => _isLoading = true);
    final homeworks = await ApiService.getHomework();
    if (mounted) {
      setState(() {
        _homeworks = homeworks;
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchNotices() async {
    setState(() => _isLoading = true);
    final notices = await ApiService.getNotices();
    if (mounted) {
      setState(() {
        _notices = notices;
        _isLoading = false;
      });
    }
  }

  void _showAddHomeworkDialog() {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    final subjectController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Add New Homework"),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: subjectController, decoration: const InputDecoration(labelText: "Subject", border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(controller: titleController, decoration: const InputDecoration(labelText: "Title", border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(controller: descController, maxLines: 3, decoration: const InputDecoration(labelText: "Description", border: OutlineInputBorder())),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (titleController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Please enter title"), backgroundColor: Colors.orange));
                return;
              }
              await ApiService.createHomework({
                "title": titleController.text,
                "description": descController.text,
                "subject": subjectController.text,
                "class": "10",
                "dueDate": DateTime.now().add(const Duration(days: 2)).toIso8601String(),
              });
              Navigator.pop(context);
              _fetchHomework();
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Homework added successfully!"), backgroundColor: Colors.green));
            }, 
            child: const Text("Add")
          ),
        ],
      ),
    );
  }

  void _showAddNoticeDialog() {
    final titleController = TextEditingController();
    final contentController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Create School Notice"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleController, decoration: const InputDecoration(labelText: "Notice Title", border: OutlineInputBorder())),
            const SizedBox(height: 12),
            TextField(controller: contentController, maxLines: 4, decoration: const InputDecoration(labelText: "Description", border: OutlineInputBorder())),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              await ApiService.createNotice({
                "title": titleController.text,
                "content": contentController.text,
                "priority": "medium",
                "targetRoles": ["student", "teacher", "parent"],
              });
              Navigator.pop(context);
              _fetchNotices();
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Notice published!"), backgroundColor: Colors.green));
            }, 
            child: const Text("Publish")
          ),
        ],
      ),
    );
  }

  void _showSubmitHomeworkDialog() {
    final titleController = TextEditingController();
    final descController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Submit Homework"),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: titleController, decoration: const InputDecoration(labelText: "Homework Title", border: OutlineInputBorder())),
              const SizedBox(height: 16),
              TextField(controller: descController, maxLines: 3, decoration: const InputDecoration(labelText: "Submission Notes", border: OutlineInputBorder())),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(border: Border.all(color: Colors.grey), borderRadius: BorderRadius.circular(8)),
                child: Row(children: [const Icon(LucideIcons.paperclip), const SizedBox(width: 8), const Text("Attach file (optional)"), const Spacer(), TextButton(onPressed: () {}, child: const Text("Browse"))]),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (titleController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Please enter homework title"), backgroundColor: Colors.orange));
                return;
              }
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Homework submitted successfully!"), backgroundColor: Colors.green));
              Navigator.pop(context);
            }, 
            child: const Text("Submit")
          ),
        ],
      ),
    );
  }

  void _showSyllabus() {
    showDialog(context: context, builder: (context) => AlertDialog(title: const Row(children: [Icon(LucideIcons.bookOpen), SizedBox(width: 8), Text("Syllabus")]), content: SizedBox(width: double.maxFinite, child: ListView(children: [_syllabusItem("Chapter 1", "Introduction & Basics", "Pages 1-15"), _syllabusItem("Chapter 2", "Advanced Concepts", "Pages 16-35"), _syllabusItem("Chapter 3", "Practical Applications", "Pages 36-50"), _syllabusItem("Chapter 4", "Case Studies", "Pages 51-70")])), actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text("Close"))]));
  }

  void _showTimetable() {
    showDialog(context: context, builder: (context) => AlertDialog(title: const Row(children: [Icon(LucideIcons.calendar), SizedBox(width: 8), Text("Timetable")]), content: SizedBox(width: double.maxFinite, child: ListView(children: [_timetableItem("Monday", "9:00 AM - 10:30 AM", "Lab 204"), _timetableItem("Tuesday", "10:30 AM - 12:00 PM", "Room 305"), _timetableItem("Wednesday", "2:00 PM - 3:30 PM", "Lab 204"), _timetableItem("Friday", "11:00 AM - 12:30 PM", "Room 305")])), actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text("Close"))]));
  }

  void _showResources() {
    showDialog(context: context, builder: (context) => AlertDialog(title: const Row(children: [Icon(LucideIcons.folder), SizedBox(width: 8), Text("Resources")]), content: SizedBox(width: double.maxFinite, child: ListView(children: [_resourceItem("Lecture Notes.pdf", "2.5 MB"), _resourceItem("Study Guide.docx", "1.2 MB"), _resourceItem("Practice Problems.xlsx", "890 KB"), _resourceItem("Video Recordings.mp4", "450 MB")])), actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text("Close"))]));
  }

  Widget _syllabusItem(String chapter, String topic, String pages) => Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(12), decoration: BoxDecoration(border: Border.all(color: Colors.grey.withOpacity(0.3)), borderRadius: BorderRadius.circular(8)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(chapter, style: const TextStyle(fontWeight: FontWeight.bold)), Text(topic, style: const TextStyle(color: AppColors.textLight, fontSize: 11)), Text(pages, style: const TextStyle(color: AppColors.primary, fontSize: 10, fontWeight: FontWeight.bold))]));

  Widget _timetableItem(String day, String time, String room) => Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(12), decoration: BoxDecoration(border: Border.all(color: Colors.grey.withOpacity(0.3)), borderRadius: BorderRadius.circular(8)), child: Row(children: [const Icon(LucideIcons.clock, size: 16, color: AppColors.primary), const SizedBox(width: 8), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(day, style: const TextStyle(fontWeight: FontWeight.bold)), Text(time, style: const TextStyle(color: AppColors.textLight, fontSize: 11))])), Text(room, style: const TextStyle(color: AppColors.primary, fontSize: 10, fontWeight: FontWeight.bold))]));

  Widget _resourceItem(String name, String size) => Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(12), decoration: BoxDecoration(border: Border.all(color: Colors.grey.withOpacity(0.3)), borderRadius: BorderRadius.circular(8)), child: Row(children: [const Icon(LucideIcons.fileText, size: 20, color: AppColors.primary), const SizedBox(width: 8), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(name, style: const TextStyle(fontWeight: FontWeight.bold)), Text(size, style: const TextStyle(color: AppColors.textLight, fontSize: 11))])), ElevatedButton(onPressed: () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Downloading $name..."))), child: const Icon(LucideIcons.download, size: 16))]));

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final userRole = context.watch<AuthService>().role;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: Icon(LucideIcons.chevronLeft, color: isDark ? Colors.white : AppColors.textDark)),
        title: Text("Assignments & Notices", style: TextStyle(color: isDark ? Colors.white : AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(onPressed: () => _showAddNoticeDialog(), icon: const Icon(LucideIcons.megaphone, color: AppColors.primary)),
          PopupMenuButton<String>(
            onSelected: (value) {
              switch (value) {
                case 'syllabus': _showSyllabus(); break;
                case 'timetable': _showTimetable(); break;
                case 'resources': _showResources(); break;
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'syllabus', child: Row(children: [Icon(LucideIcons.bookOpen), SizedBox(width: 8), Text('Syllabus')])),
              const PopupMenuItem(value: 'timetable', child: Row(children: [Icon(LucideIcons.calendar), SizedBox(width: 8), Text('Timetable')])),
              const PopupMenuItem(value: 'resources', child: Row(children: [Icon(LucideIcons.folder), SizedBox(width: 8), Text('Resources')])),
            ],
          ),
          IconButton(onPressed: _fetchData, icon: const Icon(LucideIcons.refreshCcw, color: AppColors.primary)),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textLight,
          indicatorColor: AppColors.primary,
          tabs: const [
            Tab(text: "Homework", icon: Icon(LucideIcons.bookOpen, size: 20)),
            Tab(text: "Notices", icon: Icon(LucideIcons.megaphone, size: 20)),
          ],
        ),
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : TabBarView(
            controller: _tabController,
            children: [
              _buildHomeworkList(),
              _buildNoticeList(),
            ],
          ),
      floatingActionButton: userRole == 'teacher' 
        ? FloatingActionButton.extended(
            onPressed: _showAddHomeworkDialog,
            backgroundColor: AppColors.primary,
            icon: const Icon(LucideIcons.plus, color: Colors.white),
            label: const Text("New Homework", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          )
        : FloatingActionButton.extended(
            onPressed: _showSubmitHomeworkDialog,
            backgroundColor: AppColors.primary,
            icon: const Icon(LucideIcons.check, color: Colors.white),
            label: const Text("Submit Work", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
    );
  }

  Widget _buildHomeworkList() {
    return RefreshIndicator(
      onRefresh: _fetchHomework,
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: _homeworks.isNotEmpty 
          ? _homeworks.map<Widget>((hw) => _homeworkCard(
              context, 
              hw['_id'],
              hw['subject'] ?? "General", 
              hw['dueDate']?.toString().split('T')[0] ?? "--", 
              hw['title'] ?? "No Title", 
              hw['description'] ?? "", 
              hw['status'] ?? "Pending", 
              hw['status'] == 'submitted' ? Colors.green : Colors.orange,
              context.watch<AuthService>().role == 'teacher'
            )).toList()
          : [const Center(child: Text("No homework found."))],
      ),
    );
  }

  Widget _buildNoticeList() {
    return RefreshIndicator(
      onRefresh: _fetchNotices,
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: _notices.isNotEmpty 
          ? _notices.map<Widget>((n) => _noticeCard(
              context, 
              n['_id'],
              n['title'] ?? "General Notice", 
              n['content'] ?? "", 
              n['createdAt']?.toString().split('T')[0] ?? "Today", 
              n['priority'] ?? "normal",
              context.watch<AuthService>().role == 'teacher'
            )).toList()
          : [const Center(child: Text("No notices found."))],
      ),
    );
  }

  Widget _homeworkCard(BuildContext context, String id, String sub, String date, String title, String desc, String status, Color color, bool isTeacher) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: theme.dividerColor.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(sub, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
              if (isTeacher)
                IconButton(
                  onPressed: () => _deleteHomework(id), 
                  icon: const Icon(LucideIcons.trash2, color: Colors.red, size: 18)
                )
              else
                Text("Due $date", style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
          const SizedBox(height: 4),
          Text(desc, style: const TextStyle(color: AppColors.textLight, fontSize: 13)),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(children: [const Icon(LucideIcons.user, size: 14, color: AppColors.textLight), const SizedBox(width: 8), const Text("Assigned", style: TextStyle(color: AppColors.textLight, fontSize: 12))]),
              Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6), decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)), child: Text(status, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _noticeCard(BuildContext context, String id, String title, String content, String date, String priority, bool isTeacher) {
    final theme = Theme.of(context);
    Color color = priority == 'urgent' ? Colors.red : (priority == 'important' ? Colors.orange : AppColors.primary);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: theme.dividerColor.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)), child: Text(priority.toUpperCase(), style: TextStyle(color: color, fontSize: 9, fontWeight: FontWeight.bold))),
              if (isTeacher)
                IconButton(
                  onPressed: () => _deleteNotice(id), 
                  icon: const Icon(LucideIcons.trash2, color: Colors.red, size: 18)
                )
              else
                Text(date, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          Text(content, style: const TextStyle(color: AppColors.textLight, fontSize: 13, height: 1.5)),
        ],
      ),
    );
  }
}