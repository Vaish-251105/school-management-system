import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text("Growth Analytics", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft)),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Performance Overview", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text("Key metrics for current academic session", style: TextStyle(color: AppColors.textLight)),
            const SizedBox(height: 32),

            Row(
              children: [
                Expanded(child: _metricCard("Attendance", "94.2%", LucideIcons.checkCircle, Colors.blue)),
                const SizedBox(width: 16),
                Expanded(child: _metricCard("Efficiency", "88.5%", LucideIcons.zap, Colors.orange)),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _metricCard("Revenue", "₹12.4L", LucideIcons.wallet, Colors.green)),
                const SizedBox(width: 16),
                Expanded(child: _metricCard("Expenses", "₹4.8L", LucideIcons.creditCard, Colors.red)),
              ],
            ),

            const SizedBox(height: 32),
            const Text("Student Growth", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Container(
              height: 200,
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border.withOpacity(0.5)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(LucideIcons.barChart2, size: 48, color: AppColors.primary),
                  const SizedBox(height: 16),
                  const Text("Growth chart visualization loading...", style: TextStyle(color: AppColors.textLight, fontSize: 13)),
                  const SizedBox(height: 8),
                  LinearProgressIndicator(value: 0.7, backgroundColor: AppColors.primary.withOpacity(0.1), color: AppColors.primary),
                ],
              ),
            ),

            const SizedBox(height: 32),
            const Text("Department Performance", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _deptItem("Science", 0.92, Colors.purple),
            _deptItem("Mathematics", 0.85, Colors.blue),
            _deptItem("Humanities", 0.78, Colors.green),
            _deptItem("Arts & Music", 0.88, Colors.orange),
          ],
        ),
      ),
    );
  }

  Widget _metricCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.border.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 16),
          ),
          const SizedBox(height: 12),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _deptItem(String name, double progress, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              Text("${(progress * 100).toInt()}%", style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: color.withOpacity(0.1),
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
