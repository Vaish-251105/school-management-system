import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class StudentDirectoryScreen extends StatefulWidget {
  const StudentDirectoryScreen({super.key});

  @override
  State<StudentDirectoryScreen> createState() => _StudentDirectoryScreenState();
}

class _StudentDirectoryScreenState extends State<StudentDirectoryScreen> {
  List<dynamic> students = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchStudents();
  }

  void fetchStudents() async {
    setState(() => loading = true);
    try {
      final res = await ApiService.getStudents();
      setState(() {
        students = res;
        loading = false;
      });
    } catch (e) {
      if (mounted) setState(() => loading = false);
    }
  }

  void _showAddStudentDialog() {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    final classController = TextEditingController(text: "10");
    final sectionController = TextEditingController(text: "A");
    final rollController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text("Enroll New Student", style: TextStyle(fontWeight: FontWeight.bold)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nameController, decoration: const InputDecoration(labelText: "Full Name")),
              TextField(controller: emailController, decoration: const InputDecoration(labelText: "Email Address")),
              Row(
                children: [
                  Expanded(child: TextField(controller: classController, decoration: const InputDecoration(labelText: "Class"))),
                  const SizedBox(width: 16),
                  Expanded(child: TextField(controller: sectionController, decoration: const InputDecoration(labelText: "Section"))),
                ],
              ),
              TextField(controller: rollController, decoration: const InputDecoration(labelText: "Roll Number"), keyboardType: TextInputType.number),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
            onPressed: () async {
               final data = {
                 "name": nameController.text,
                 "email": emailController.text,
                 "class": classController.text,
                 "section": sectionController.text,
                 "rollNumber": int.tryParse(rollController.text) ?? 0,
                 "password": "123"
               };
               Navigator.pop(context);
               await ApiService.post("students", data);
               fetchStudents();
            }, 
            child: const Text("Enroll", style: TextStyle(color: Colors.white))
          )
        ],
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.only(top: 60, left: 10, right: 10, bottom: 30),
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [AppColors.secondary, AppColors.primary]),
              borderRadius: BorderRadius.only(bottomLeft: Radius.circular(30), bottomRight: Radius.circular(30)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20), onPressed: () => Navigator.pop(context)),
                    const Text("Student Directory", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                    IconButton(
                      icon: const Icon(Icons.person_add_alt_1, color: Colors.white, size: 24),
                      onPressed: _showAddStudentDialog,
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 10),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(16)),
                  child: const TextField(
                    style: TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: "Search students...",
                      hintStyle: TextStyle(color: Colors.white70),
                      prefixIcon: Icon(Icons.search, color: Colors.white70),
                      border: InputBorder.none,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text("Student Overview", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
                  Text("${students.length} Total Enrolled", style: const TextStyle(color: AppColors.textLight, fontSize: 13)),
                ]),
                IconButton(onPressed: fetchStudents, icon: const Icon(Icons.refresh, color: AppColors.primary)),
              ],
            ),
          ),
          Expanded(
            child: loading 
              ? const Center(child: CircularProgressIndicator())
              : students.isEmpty
                ? const Center(child: Text("No students found."))
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: students.length,
                    itemBuilder: (context, index) {
                      final s = students[index];
                      return _buildStudentCard(
                        s['userId']?['name'] != null ? s['userId']['name'][0].toUpperCase() : "S", 
                        s['userId']?['name'] ?? "Student", 
                        "Grade ${s['class'] ?? 'N/A'}", 
                        s['section'] ?? '-', 
                        "#${s['rollNumber'] ?? '0'}",
                        s['_id']
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentCard(String initials, String name, String className, String section, String roll, String id) {
    return Dismissible(
      key: Key(id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(16)),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      onDismissed: (dir) async {
        await ApiService.delete("students/$id");
        fetchStudents();
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
        child: Row(
          children: [
            Container(
              width: 50, height: 50,
              decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Center(child: Text(initials, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 18))),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                  Row(
                    children: [
                      const Icon(Icons.school, size: 12, color: AppColors.textLight),
                      const SizedBox(width: 4),
                      Text(className, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
                      const SizedBox(width: 12),
                      Text("Section $section", style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
                    ],
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(color: Colors.indigo.withOpacity(0.05), borderRadius: BorderRadius.circular(20)),
              child: Text(roll, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 10)),
            ),
          ],
        ),
      ),
    );
  }
}
