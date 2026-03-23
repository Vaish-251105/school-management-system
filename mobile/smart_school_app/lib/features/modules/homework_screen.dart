import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';

class HomeworkScreen extends StatelessWidget {
  const HomeworkScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: Icon(LucideIcons.chevronLeft, color: isDark ? Colors.white : AppColors.textDark)),
        title: const Text("Homework", style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Loading all assignments..."))),
            icon: const Icon(LucideIcons.bell, color: AppColors.primary),
          )
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _homeworkCard(context, "Mathematics", "Oct 28", "Quadratic Equations", "Solve ex 4.1 to 4.3", "Pending", Colors.orange),
          _homeworkCard(context, "Physics", "Oct 29", "Light Reflection", "Lab report submission", "Submitted", Colors.green),
          _homeworkCard(context, "English", "Nov 02", "Shakespeare", "Critical analysis of Hamlet", "Pending", Colors.blue),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Opening Homework Submission Portal..."))),
        backgroundColor: AppColors.primary,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text("Submit Homework", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _homeworkCard(BuildContext context, String sub, String date, String title, String desc, String status, Color color) {
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
              Row(children: [const Icon(LucideIcons.user, size: 14, color: AppColors.textLight), const SizedBox(width: 8), const Text("Dr. Smith", style: TextStyle(color: AppColors.textLight, fontSize: 12))]),
              Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6), decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)), child: Text(status, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold))),
            ],
          ),
        ],
      ),
    );
  }
}