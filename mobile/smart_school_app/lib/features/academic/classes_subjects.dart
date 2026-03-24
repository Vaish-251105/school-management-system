import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class ClassesSubjectsScreen extends StatefulWidget {
  const ClassesSubjectsScreen({super.key});

  @override
  State<ClassesSubjectsScreen> createState() => _ClassesSubjectsScreenState();
}

class _ClassesSubjectsScreenState extends State<ClassesSubjectsScreen> {
  List<dynamic> classList = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchClasses();
  }

  Future<void> _fetchClasses() async {
    final res = await ApiService.getClasses();
    setState(() {
      classList = res;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // HEADER
            Container(
              padding: const EdgeInsets.fromLTRB(24, 60, 24, 30),
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [AppColors.secondary, AppColors.primary]),
                borderRadius: BorderRadius.only(bottomLeft: Radius.circular(40), bottomRight: Radius.circular(40)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                          child: const Icon(LucideIcons.chevronLeft, color: Colors.white, size: 20),
                        ),
                      ),
                      const Text("Classes & Subjects", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                        child: const Icon(LucideIcons.search, color: Colors.white, size: 20),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  const Text("Academic Year 2024", style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  const Text("Manage Schedule", style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // TABS
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  _buildTab("Active Classes", true),
                  const SizedBox(width: 24),
                  _buildTab("Subject List", false),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // CONTENT
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Current Classes", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                  const SizedBox(height: 16),
                  if (isLoading)
                    const Center(child: CircularProgressIndicator())
                  else
                    ...classList.map((c) {
                      final title = c is String ? c : (c['name'] ?? "Class");
                      return _buildClassCard(title, "Section A", "Room 402", "32", "8", "Dr. Sarah Jenkins", Colors.blue);
                    }),

                  const SizedBox(height: 32),
                  const Text("Core Subjects", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                  const SizedBox(height: 16),
                  _buildSubjectCard(LucideIcons.calculator, "Advanced Mathematics", "MATH-101", "Mon, Wed, Fri", "4 Credits", Colors.blue),
                  _buildSubjectCard(LucideIcons.flame, "Quantum Physics", "PHYS-202", "Tue, Thu", "3 Credits", Colors.orange),
                  _buildSubjectCard(LucideIcons.book, "English Literature", "ENG-105", "Mon, Tue, Thu", "3 Credits", Colors.green),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddClassDialog,
        backgroundColor: AppColors.primary,
        child: const Icon(LucideIcons.plus, color: Colors.white),
      ),
    );
  }

  void _showAddClassDialog() {
     final nameController = TextEditingController();
     showDialog(
       context: context,
       builder: (context) => AlertDialog(
         title: const Text("Create New Class"),
         content: TextField(controller: nameController, decoration: const InputDecoration(hintText: "e.g. Grade 12-C")),
         actions: [
           TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
           ElevatedButton(
             onPressed: () async {
               if (nameController.text.isNotEmpty) {
                 await ApiService.createClass({"name": nameController.text});
                 Navigator.pop(context);
                 _fetchClasses();
               }
             }, 
             child: const Text("Create")
           ),
         ],
       ),
     );
  }

  Widget _buildTab(String title, bool isActive) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: TextStyle(color: isActive ? AppColors.primary : AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 4),
        if (isActive) Container(height: 3, width: 20, decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(2))),
      ],
    );
  }

  Widget _buildClassCard(String grade, String section, String room, String students, String subjects, String teacher, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.border.withOpacity(0.5)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(grade, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: AppColors.textDark)),
                  Text(section, style: const TextStyle(color: AppColors.textLight, fontSize: 13)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                child: Text(room, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
              )
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _infoItem("Students", students),
              _infoItem("Subjects", subjects),
              const CircleAvatar(radius: 12, backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=1')),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              const Icon(LucideIcons.user, size: 14, color: AppColors.primary),
              const SizedBox(width: 8),
              Text("Teacher: $teacher", style: const TextStyle(fontSize: 13, color: AppColors.textDark, fontWeight: FontWeight.w500)),
            ],
          )
        ],
      ),
    );
  }

  Widget _infoItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 11, fontWeight: FontWeight.bold)),
        Text(value, style: const TextStyle(color: AppColors.textDark, fontSize: 16, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildSubjectCard(IconData icon, String name, String code, String days, String credits, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border.withOpacity(0.5)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                Text(code, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
              ],
            ),
          ),
          Text(credits, style: const TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
