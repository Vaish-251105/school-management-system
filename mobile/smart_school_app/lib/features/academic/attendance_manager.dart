import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class AttendanceManagerScreen extends StatefulWidget {
  const AttendanceManagerScreen({super.key});

  @override
  State<AttendanceManagerScreen> createState() => _AttendanceManagerScreenState();
}

class _AttendanceManagerScreenState extends State<AttendanceManagerScreen> {
  List<dynamic> students = [];
  Map<String, String> attendance = {};
  bool loading = true;
  bool submitting = false;
  int selectedDayIndex = 1;

  final List<Map<String, String>> days = [
    {"day": "Mon", "date": "23"},
    {"day": "Tue", "date": "24"},
    {"day": "Wed", "date": "25"},
    {"day": "Thu", "date": "26"},
    {"day": "Fri", "date": "27"},
    {"day": "Sat", "date": "28"},
  ];

  @override
  void initState() {
    super.initState();
    fetchStudents();
  }

  void fetchStudents() async {
    try {
      final res = await ApiService.getStudents();
      setState(() {
        students = res;
        for (var s in res) {
          attendance[s['_id']] = 'present';
        }
        loading = false;
      });
    } catch (e) {
      setState(() => loading = false);
    }
  }

  void handleMark(String id, String status) {
    setState(() => attendance[id] = status);
  }

  void markAllPresent() {
    setState(() {
      for (var s in students) {
        attendance[s['_id']] = 'present';
      }
    });
  }

  void submitAttendance() async {
    setState(() => submitting = true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Attendance submitted successfully! ✅"),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.success,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e"), backgroundColor: AppColors.error),
      );
    } finally {
      setState(() => submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    int presentCount = attendance.values.where((v) => v == 'present').length;
    int absentCount = attendance.values.where((v) => v == 'absent').length;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // HEADER
          Container(
            padding: const EdgeInsets.fromLTRB(24, 50, 24, 30),
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [AppColors.secondary, AppColors.primary], begin: Alignment.topLeft, end: Alignment.bottomRight),
              borderRadius: BorderRadius.only(bottomLeft: Radius.circular(40), bottomRight: Radius.circular(40)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft, color: Colors.white)),
                    const Text("Attendance Manager", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    const Icon(LucideIcons.bell, color: Colors.white, size: 24),
                  ],
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  decoration: BoxDecoration(color: Colors.white.withOpacity(0.12), borderRadius: BorderRadius.circular(16)),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.graduationCap, color: Colors.white, size: 22),
                      const SizedBox(width: 14),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text("Current Selection", style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                          Text("Grade 10 - Section A", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                        ],
                      ),
                      const Spacer(),
                      const Icon(LucideIcons.chevronDown, color: Colors.white, size: 20),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // STATS & DATE PICKER
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildStatBox("Total", students.length.toString(), AppColors.primary),
                        _buildStatBox("Present", presentCount.toString(), AppColors.success),
                        _buildStatBox("Absent", (absentCount < 10 ? "0$absentCount" : "$absentCount"), AppColors.error),
                      ],
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("October 2023", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                        Row(
                          children: const [
                            Icon(LucideIcons.calendar, color: AppColors.primary, size: 16),
                            SizedBox(width: 6),
                            Text("Calendar", style: TextStyle(color: AppColors.primary, fontSize: 13, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  SizedBox(
                    height: 80,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: days.length,
                      itemBuilder: (context, index) {
                        bool isSelected = index == selectedDayIndex;
                        return GestureDetector(
                          onTap: () => setState(() => selectedDayIndex = index),
                          child: Container(
                            width: 65,
                            margin: const EdgeInsets.symmetric(horizontal: 8),
                            decoration: BoxDecoration(
                              color: isSelected ? Colors.white : AppColors.inputBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: isSelected ? AppColors.primary : Colors.transparent),
                              boxShadow: isSelected ? [BoxShadow(color: AppColors.primary.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4))] : [],
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(days[index]["day"]!, style: TextStyle(color: isSelected ? AppColors.textLight : AppColors.textLight.withOpacity(0.6), fontSize: 11, fontWeight: FontWeight.bold)),
                                Text(days[index]["date"]!, style: TextStyle(color: isSelected ? AppColors.textDark : AppColors.textDark.withOpacity(0.6), fontSize: 20, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 32),

                  // STUDENT LIST
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(50))),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text("Student List", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: AppColors.textDark)),
                            _markAllButton(),
                          ],
                        ),
                        const SizedBox(height: 24),
                        if (loading) const CircularProgressIndicator() else _buildStudentList(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // BOTTOM ADDENDANCE BUTTON
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, -4))]),
            child: SizedBox(
              width: double.infinity, height: 56,
              child: ElevatedButton.icon(
                onPressed: submitting ? null : submitAttendance,
                icon: const Icon(LucideIcons.checkCircle, color: Colors.white, size: 20),
                label: const Text("Submit Attendance", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatBox(String title, String value, Color color) {
    return Container(
      width: (MediaQuery.of(context).size.width - 72) / 3,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _markAllButton() {
    return GestureDetector(
      onTap: markAllPresent,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
        child: Row(
          children: const [
            Icon(LucideIcons.check, size: 14, color: AppColors.primary),
            SizedBox(width: 8),
            Text("Mark All Present", style: TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentList() {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: students.length,
      itemBuilder: (context, index) {
        final s = students[index];
        final id = s['_id'];
        final isPresent = attendance[id] == 'present';
        final isAbsent = attendance[id] == 'absent';

        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border.withOpacity(0.6)),
          ),
          child: Row(
            children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(color: isPresent ? AppColors.primary.withOpacity(0.1) : AppColors.inputBg, shape: BoxShape.circle, border: Border.all(color: AppColors.primary.withOpacity(0.2))),
                child: Center(child: Text(s['userId']?['name']?[0] ?? "S", style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold))),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(s['userId']?['name'] ?? "Student", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                    Text("Roll No: ${index + 1}", style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => handleMark(id, 'present'),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: isPresent ? Colors.green.withOpacity(0.1) : AppColors.inputBg, shape: BoxShape.circle),
                  child: Icon(LucideIcons.checkCircle2, color: isPresent ? Colors.green : Colors.grey.shade400, size: 24),
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: () => handleMark(id, 'absent'),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: isAbsent ? Colors.red.withOpacity(0.1) : AppColors.inputBg, shape: BoxShape.circle),
                  child: Icon(LucideIcons.xCircle, color: isAbsent ? Colors.red : Colors.grey.shade400, size: 24),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
