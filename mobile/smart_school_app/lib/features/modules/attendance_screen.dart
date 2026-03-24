import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';

import '../../services/api_service.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  List<dynamic> _logs = [];
  bool _isLoading = true;
  int _present = 0;
  int _absent = 0;
  String _selectedClass = "10-A";
  DateTime _selectedDate = DateTime.now();
  List<dynamic> _students = [];
  Map<String, bool> _attendanceStatus = {};

  final List<String> _classes = ["10-A", "10-B", "9-A", "9-B", "8-A", "8-B"];

  @override
  void initState() {
    super.initState();
    _loadStudents();
    _loadAttendance();
  }

  Future<void> _loadStudents() async {
    final students = await ApiService.getStudents();
    setState(() {
      _students = students.where((s) => s['class'] == _selectedClass).toList();
      _attendanceStatus = {for (var student in _students) student['_id']: true};
    });
  }

  Future<void> _loadAttendance() async {
    setState(() => _isLoading = true);
    final data = await ApiService.getAttendance();
    int p = 0;
    int a = 0;
    for (var log in data) {
      if (log['status'] == 'present') p++; else a++;
    }

    if (mounted) {
      setState(() {
        _logs = data;
        _present = p;
        _absent = a;
        _isLoading = false;
      });
    }
  }

  Future<void> _submitAttendance() async {
    setState(() => _isLoading = true);
    
    for (var student in _students) {
      await ApiService.markAttendance({
        "studentId": student['_id'],
        "status": _attendanceStatus[student['_id']] == true ? "present" : "absent",
        "date": _selectedDate.toIso8601String(),
        "class": _selectedClass,
      });
    }
    
    await _loadAttendance();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Attendance submitted successfully!"),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _showNotifications() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(children: [Icon(LucideIcons.bell), SizedBox(width: 8), Text("Notifications")]),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView(
            shrinkWrap: true,
            children: [
              _notificationTile("Attendance marked successfully", "Today at 10:30 AM"),
              _notificationTile("New homework assignment", "Yesterday at 2:45 PM"),
              _notificationTile("Exam schedule published", "2 days ago"),
              if(_logs.isEmpty) const Center(child: Text("No new notifications")),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Close")),
        ],
      ),
    );
  }

  Widget _notificationTile(String title, String time) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(border: Border.all(color: Colors.grey.withOpacity(0.3)), borderRadius: BorderRadius.circular(8)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(time, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
      ]),
    );
  }

  void _openClassChat() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(children: [Icon(LucideIcons.messageCircle), SizedBox(width: 8), Text("Class Chat")]),
        content: SizedBox(
          width: double.maxFinite,
          height: 300,
          child: Column(children: [
            Expanded(
              child: ListView(children: [
                _chatMessage("Teacher", "Don't forget the homework submission", true),
                _chatMessage("You", "Thank you sir!", false),
                _chatMessage("Teacher", "Anyone has questions?", true),
              ]),
            ),
            const SizedBox(height: 16),
            Row(children: [
              Expanded(child: TextField(decoration: InputDecoration(hintText: "Type message...", border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))))),
              const SizedBox(width: 8),
              ElevatedButton(onPressed: () {}, child: const Icon(LucideIcons.send, size: 18)),
            ]),
          ]),
        ),
        actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text("Close"))],
      ),
    );
  }

  Widget _chatMessage(String sender, String message, bool isTeacher) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Align(
        alignment: isTeacher ? Alignment.centerLeft : Alignment.centerRight,
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isTeacher ? Colors.grey[300] : AppColors.primary,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(sender, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: isTeacher ? Colors.black : Colors.white)),
            Text(message, style: TextStyle(color: isTeacher ? Colors.black : Colors.white, fontSize: 14)),
          ]),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final userRole = context.watch<AuthService>().role;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      floatingActionButton: userRole == 'teacher' 
        ? FloatingActionButton.extended(
            onPressed: _submitAttendance,
            backgroundColor: AppColors.primary,
            icon: const Icon(LucideIcons.checkCircle, color: Colors.white),
            label: const Text("Submit Attendance", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          )
        : null,
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : RefreshIndicator(
            onRefresh: _loadAttendance,
            child: Column(
              children: [
                _buildHeader(context),
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(24),
                    children: [
                      if (userRole == 'teacher') ...[
                        _buildClassSelector(context),
                        const SizedBox(height: 16),
                        _buildDateSelector(context),
                        const SizedBox(height: 24),
                        _buildStudentList(context),
                        const SizedBox(height: 32),
                      ],
                      _buildStatsSummary(context),
                      const SizedBox(height: 32),
                      Text("Attendance Records", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                      const SizedBox(height: 16),
                      if (_logs.isEmpty)
                         const Center(child: Text("No attendance records found."))
                      else
                        ..._logs.map((log) => _attendanceTile(
                            context, 
                            log['date']?.toString().split('T')[0] ?? "--", 
                            log['status'] == 'present' ? "Present" : "Absent", 
                            "Entry recorded", 
                            log['status'] == 'present' ? Colors.green : Colors.red
                        )),
                    ],
                  ),
                ),
              ],
            ),
          ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 60, 24, 30),
      decoration: const BoxDecoration(
        gradient: LinearGradient(colors: [Color(0xFF6366F1), Color(0xFF4F46E5)]),
        borderRadius: BorderRadius.only(bottomLeft: Radius.circular(40), bottomRight: Radius.circular(40)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft, color: Colors.white)),
              const Text("Attendance", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              Row(
                children: [
                  IconButton(
                    onPressed: _showNotifications,
                    icon: const Icon(LucideIcons.bell, color: Colors.white),
                  ),
                  IconButton(
                    onPressed: _openClassChat,
                    icon: const Icon(LucideIcons.messageCircle, color: Colors.white),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 32),
          const Text("Average attendance", style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text("94.2%", style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildClassSelector(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          const Icon(LucideIcons.school, color: AppColors.primary),
          const SizedBox(width: 16),
          const Text("Select Class:", style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(width: 16),
          Expanded(
            child: DropdownButton<String>(
              value: _selectedClass,
              isExpanded: true,
              items: _classes.map((String className) {
                return DropdownMenuItem<String>(
                  value: className,
                  child: Text(className),
                );
              }).toList(),
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    _selectedClass = newValue;
                    _loadStudents();
                  });
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateSelector(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          const Icon(LucideIcons.calendar, color: AppColors.primary),
          const SizedBox(width: 16),
          const Text("Select Date:", style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(width: 16),
          Expanded(
            child: GestureDetector(
              onTap: () async {
                final DateTime? picked = await showDatePicker(
                  context: context,
                  initialDate: _selectedDate,
                  firstDate: DateTime(2023),
                  lastDate: DateTime(2025),
                );
                if (picked != null) {
                  setState(() {
                    _selectedDate = picked;
                  });
                }
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  "${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}",
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentList(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Mark Attendance for ${_selectedClass}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        ..._students.map((student) => Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.05)),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: AppColors.primary.withOpacity(0.1),
                child: Text(
                  student['name']?.split(' ').map((n) => n[0]).join('').toUpperCase() ?? "S",
                  style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(student['name'] ?? "Unknown Student", style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text("Roll No: ${student['rollNo'] ?? 'N/A'}", style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
                  ],
                ),
              ),
              Switch(
                value: _attendanceStatus[student['_id']] ?? true,
                onChanged: (bool value) {
                  setState(() {
                    _attendanceStatus[student['_id']] = value;
                  });
                },
                activeColor: Colors.green,
                inactiveThumbColor: Colors.red,
                inactiveTrackColor: Colors.red.withOpacity(0.3),
              ),
            ],
          ),
        )),
      ],
    );
  }

  Widget _buildStatsSummary(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _statCol("Present", _present.toString(), Colors.green),
          _statCol("Absent", _absent.toString(), Colors.red),
          _statCol("Holiday", "0", Colors.blue),
        ],
      ),
    );
  }

  Widget _statCol(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
      ],
    );
  }

  Widget _attendanceTile(BuildContext context, String date, String status, String note, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Details: $date - $status ($note)"), backgroundColor: color.withOpacity(0.8)),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.05)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
              child: Icon(status == "Present" ? LucideIcons.check : LucideIcons.x, color: color, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(date, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(note, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
              child: Text(status, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}