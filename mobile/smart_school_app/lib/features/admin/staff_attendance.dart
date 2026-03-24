import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class StaffAttendanceScreen extends StatefulWidget {
  const StaffAttendanceScreen({super.key});

  @override
  State<StaffAttendanceScreen> createState() => _StaffAttendanceScreenState();
}

class _StaffAttendanceScreenState extends State<StaffAttendanceScreen> {
  List<dynamic> _staffList = [];
  Map<String, String> _attendance = {}; 
  bool _isLoading = true;
  DateTime _selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() => _isLoading = true);
    final staff = await ApiService.getStaff();
    final logs = await ApiService.getStaffAttendanceList(date: _selectedDate.toIso8601String().split('T')[0]);
    
    final Map<String, String> initial = {};
    for (var s in staff) {
      final log = logs.firstWhere((l) => l['staffId']['_id'] == s['userId']['_id'], orElse: () => null);
      initial[s['userId']['_id']] = log != null ? log['status'] : "Present";
    }

    setState(() {
      _staffList = staff;
      _attendance = initial;
      _isLoading = false;
    });
  }

  Future<void> _submit() async {
    setState(() => _isLoading = true);
    List<Map<String, dynamic>> data = _attendance.entries.map((e) => {
      "staffId": e.key,
      "status": e.value
    }).toList();

    await ApiService.markStaffAttendance(data, _selectedDate.toIso8601String().split('T')[0]);
    _fetchData();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Staff Attendance Saved"), backgroundColor: Colors.green));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Staff Attendance", style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : Column(
            children: [
              _buildDateSelector(),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _staffList.length,
                  itemBuilder: (context, index) {
                    final staff = _staffList[index];
                    final user = staff['userId'] ?? {};
                    final id = user['_id'];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: ListTile(
                        leading: CircleAvatar(child: Text(user['name']?[0] ?? "S")),
                        title: Text(user['name'] ?? "Staff"),
                        subtitle: Text(user['role']?.toString().toUpperCase() ?? "STAFF"),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            ChoiceChip(
                              label: const Text("P"),
                              selected: _attendance[id] == "Present",
                              onSelected: (val) => setState(() => _attendance[id!] = "Present"),
                              selectedColor: Colors.green,
                              labelStyle: TextStyle(color: _attendance[id] == "Present" ? Colors.white : Colors.black),
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text("A"),
                              selected: _attendance[id] == "Absent",
                              onSelected: (val) => setState(() => _attendance[id!] = "Absent"),
                              selectedColor: Colors.red,
                              labelStyle: TextStyle(color: _attendance[id] == "Absent" ? Colors.white : Colors.black),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(24),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text("SAVE ATTENDANCE", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ),
            ],
          ),
    );
  }

  Widget _buildDateSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.grey[100],
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text("Date:", style: TextStyle(fontWeight: FontWeight.bold)),
          TextButton.icon(
            onPressed: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: _selectedDate,
                firstDate: DateTime(2023),
                lastDate: DateTime.now(),
              );
              if (picked != null) {
                setState(() => _selectedDate = picked);
                _fetchData();
              }
            },
            icon: const Icon(LucideIcons.calendar),
            label: Text("${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}"),
          ),
        ],
      ),
    );
  }
}
