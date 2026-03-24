import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  String? _selectedClass;
  DateTime? _selectedDate;
  List<dynamic> _students = [];
  final Map<String, bool> _attendance = {};
  bool _isLoading = false;
  List<String> _classes = ['Class A', 'Class B', 'Class C', 'Class D'];

  @override
  void initState() {
    super.initState();
    _selectedDate = DateTime.now();
  }

  Future<void> _loadStudents() async {
    if (_selectedClass == null) return;

    setState(() => _isLoading = true);
    try {
      final students = await ApiService.getStudents();
      if (mounted) {
        setState(() {
          _students = students is List ? students : [];
          _attendance.clear();
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

  Future<void> _submitAttendance() async {
    if (_selectedClass == null || _selectedDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select class and date")),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      await ApiService.post("attendance/bulk", {
        "classId": _selectedClass,
        "date": _selectedDate?.toIso8601String(),
        "attendance": _attendance,
      });

      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Attendance marked successfully!"), backgroundColor: Colors.green),
        );
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

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;
    final isTablet = MediaQuery.of(context).size.width >= 600 && MediaQuery.of(context).size.width < 1024;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft)),
        title: const Text("Mark Attendance", style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(isMobile ? 16 : 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Selection Cards Section
                    if (isMobile)
                      Column(children: [_buildClassSelector(), const SizedBox(height: 16), _buildDateSelector()])
                    else
                      Row(
                        children: [
                          Expanded(child: _buildClassSelector()),
                          const SizedBox(width: 16),
                          Expanded(child: _buildDateSelector()),
                        ],
                      ),
                    
                    const SizedBox(height: 24),

                    // Students List
                    if (_students.isEmpty)
                      Center(
                        child: Column(
                          children: [
                            Icon(LucideIcons.users2, size: 64, color: Colors.grey[400]),
                            const SizedBox(height: 16),
                            Text(
                              _selectedClass == null ? "Select a class to view students" : "No students found",
                              style: TextStyle(color: Colors.grey[600], fontSize: 16),
                            ),
                          ],
                        ),
                      )
                    else
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Mark Attendance (${_students.length} students)",
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          if (isMobile)
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _students.length,
                              itemBuilder: (_, i) => _buildStudentRow(_students[i]),
                            )
                          else
                            SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: DataTable(
                                columns: const [
                                  DataColumn(label: Text("Name")),
                                  DataColumn(label: Text("Roll No.")),
                                  DataColumn(label: Text("Present")),
                                ],
                                rows: _students.asMap().entries.map<DataRow>((e) {
                                  final student = e.value;
                                  final id = student['_id'] ?? e.key.toString();
                                  return DataRow(cells: [
                                    DataCell(Text(student['name'] ?? "Unknown")),
                                    DataCell(Text(student['rollNo']?.toString() ?? "-")),
                                    DataCell(Checkbox(
                                      value: _attendance[id] ?? false,
                                      onChanged: (value) => setState(() => _attendance[id] = value ?? false),
                                    )),
                                  ]);
                                }).toList(),
                              ),
                            ),
                        ],
                      ),

                    const SizedBox(height: 32),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _submitAttendance,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text(
                          "Submit Attendance",
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildClassSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(LucideIcons.book2, size: 20, color: AppColors.primary),
              const SizedBox(width: 8),
              const Text("Select Class", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 12),
          DropdownButton<String>(
            isExpanded: true,
            value: _selectedClass,
            underline: const SizedBox(),
            items: _classes.map((cls) => DropdownMenuItem(value: cls, child: Text(cls))).toList(),
            onChanged: (value) => setState(() {
              _selectedClass = value;
              _loadStudents();
            }),
            hint: const Text("Choose a class"),
          ),
        ],
      ),
    );
  }

  Widget _buildDateSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(LucideIcons.calendar, size: 20, color: AppColors.primary),
              const SizedBox(width: 8),
              const Text("Select Date", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _selectedDate ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime.now(),
              );
              if (date != null) setState(() => _selectedDate = date);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.secondary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _selectedDate == null ? "Pick date" : DateFormat('dd MMM yyyy').format(_selectedDate!),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Icon(LucideIcons.chevronDown, size: 18, color: AppColors.primary),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentRow(dynamic student) {
    final id = student['_id'] ?? student['id'] ?? student['name'];
    final name = student['name'] ?? "Unknown";
    final rollNo = student['rollNo'] ?? "-";

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 4),
                Text("Roll: $rollNo", style: TextStyle(color: AppColors.textLight, fontSize: 12)),
              ],
            ),
          ),
          Checkbox(
            value: _attendance[id] ?? false,
            onChanged: (value) => setState(() => _attendance[id] = value ?? false),
            activeColor: AppColors.primary,
          ),
        ],
      ),
    );
  }
}
