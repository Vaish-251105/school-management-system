import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';

class TimetableScreen extends StatelessWidget {
  const TimetableScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: Icon(LucideIcons.chevronLeft, color: isDark ? Colors.white : AppColors.textDark)),
        title: const Text("Weekly Timetable", style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Downloading Timetable PDF..."))),
            icon: const Icon(LucideIcons.download, color: AppColors.primary),
          )
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          _buildDayPicker(context),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(24),
              children: [
                _classTile(context, "08:30 AM", "Mathematics", "Calculus & Algebra", "Room 204", Colors.indigo),
                _classTile(context, "10:15 AM", "Physics", "Quantum Mechanics", "Hall A", Colors.teal),
                _classTile(context, "12:00 PM", "Lunch Break", "Cafeteria", "Ground Floor", Colors.orange),
                _classTile(context, "01:30 PM", "English", "Hamlet analysis", "Room 105", Colors.pink),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDayPicker(BuildContext context) {
    return Container(
      height: 80,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        children: [
          _dayChip("MON", "23", true),
          _dayChip("TUE", "24", false),
          _dayChip("WED", "25", false),
          _dayChip("THU", "26", false),
          _dayChip("FRI", "27", false),
          _dayChip("SAT", "28", false),
        ],
      ),
    );
  }

  Widget _dayChip(String day, String date, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(right: 12),
      width: 60,
      decoration: BoxDecoration(color: isSelected ? AppColors.primary : Colors.transparent, borderRadius: BorderRadius.circular(20), border: Border.all(color: isSelected ? AppColors.primary : AppColors.border.withOpacity(0.1))),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Text(day, style: TextStyle(color: isSelected ? Colors.white : AppColors.textLight, fontSize: 10, fontWeight: FontWeight.bold)), const SizedBox(height: 4), Text(date, style: TextStyle(color: isSelected ? Colors.white : AppColors.textDark, fontSize: 16, fontWeight: FontWeight.bold))]),
    );
  }

  Widget _classTile(BuildContext context, String time, String subject, String topic, String room, Color color) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: theme.dividerColor.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Container(width: 12, height: 60, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(6))),
          const SizedBox(width: 20),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(subject, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(topic, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
          ])),
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Text(time, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.primary)),
            Text(room, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
          ]),
        ],
      ),
    );
  }
}