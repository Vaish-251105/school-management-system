import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class ExamScheduleScreen extends StatefulWidget {
  const ExamScheduleScreen({super.key});

  @override
  State<ExamScheduleScreen> createState() => _ExamScheduleScreenState();
}

class _ExamScheduleScreenState extends State<ExamScheduleScreen> {
  List<dynamic> _exams = [];
  bool _isLoading = true;
  final _nameController = TextEditingController();
  final _subjectController = TextEditingController();
  String _selectedClass = "10-A";
  DateTime _selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    _fetchExams();
  }

  Future<void> _fetchExams() async {
    setState(() => _isLoading = true);
    final exams = await ApiService.getExamSchedule(className: _selectedClass);
    setState(() {
      _exams = exams;
      _isLoading = false;
    });
  }

  Future<void> _createExam() async {
    if (_nameController.text.isEmpty || _subjectController.text.isEmpty) return;
    
    await ApiService.createExamSchedule({
      "name": _nameController.text,
      "subject": _subjectController.text,
      "class": _selectedClass,
      "examDate": _selectedDate.toIso8601String(),
      "totalMarks": 100
    });
    
    _nameController.clear();
    _subjectController.clear();
    Navigator.pop(context);
    _fetchExams();
  }

  void _showAddDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Schedule New Exam"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: _nameController, decoration: const InputDecoration(labelText: "Exam Name (e.g. Midterm)")),
            TextField(controller: _subjectController, decoration: const InputDecoration(labelText: "Subject")),
            const SizedBox(height: 12),
            ListTile(
              title: Text("Date: ${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}"),
              trailing: const Icon(LucideIcons.calendar),
              onTap: () async {
                final picked = await showDatePicker(context: context, initialDate: _selectedDate, firstDate: DateTime.now(), lastDate: DateTime(2025));
                if (picked != null) setState(() => _selectedDate = picked);
              },
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(onPressed: _createExam, child: const Text("Schedule")),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Exam Schedule"),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddDialog,
        backgroundColor: AppColors.primary,
        child: const Icon(LucideIcons.plus, color: Colors.white),
      ),
      body: Column(
        children: [
          _buildClassSelector(),
          Expanded(
            child: _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : _exams.isEmpty 
                ? const Center(child: Text("No exams scheduled"))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _exams.length,
                    itemBuilder: (context, index) {
                      final exam = _exams[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: const CircleAvatar(backgroundColor: Colors.amber, child: Icon(LucideIcons.fileText, color: Colors.white, size: 20)),
                          title: Text(exam['name'] ?? "Exam", style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text("${exam['subject']} • ${exam['examDate']?.toString().split('T')[0]}"),
                          trailing: const Icon(LucideIcons.chevronRight),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildClassSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.grey[100],
      child: Row(
        children: [
          const Text("Class: ", style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(width: 12),
          DropdownButton<String>(
            value: _selectedClass,
            items: ["10-A", "10-B", "9-A", "9-B"].map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
            onChanged: (val) {
              if (val != null) {
                setState(() => _selectedClass = val);
                _fetchExams();
              }
            },
          ),
        ],
      ),
    );
  }
}
