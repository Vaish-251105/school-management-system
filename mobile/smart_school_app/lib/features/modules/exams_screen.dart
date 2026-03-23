import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';

class ExamsScreen extends StatelessWidget {
  const ExamsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: Icon(LucideIcons.chevronLeft, color: isDark ? Colors.white : AppColors.textDark)),
        title: Text("Exam Results", style: TextStyle(color: isDark ? Colors.white : AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [IconButton(onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Report download started!"))), icon: const Icon(LucideIcons.download, color: AppColors.primary))],
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // USER INFO CARD
            Container(
              margin: const EdgeInsets.all(24),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFF4F46E5)]),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.white24,
                    child: Text(
                      context.watch<AuthService>().name.split(' ').map((n) => n[0]).join('').toUpperCase(),
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(context.watch<AuthService>().name, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                        Text("ID: #${context.watch<AuthService>().email.isEmpty ? 'STU90210' : context.watch<AuthService>().email.split('@')[0].toUpperCase()} • Class 10-B", style: const TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(20)),
                          child: const Text("Final Term Examination 2023-24", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // STATS ROW
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _statBox(context, "GPA", "3.85 / 4.0"),
                  _statBox(context, "Percentage", "89.4%"),
                  _statBox(context, "Rank", "4th / 45"),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // SUBJECT ANALYSIS CHART
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface, 
                borderRadius: BorderRadius.circular(30), 
                border: Border.all(color: theme.dividerColor.withOpacity(0.05))
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Subject Wise Analysis", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 32),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      _bar(70, "Math"),
                      _bar(90, "Sci"),
                      _bar(60, "Eng"),
                      _bar(80, "His"),
                      _bar(95, "CS"),
                      _bar(65, "Art"),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // DETAILED MARKS
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Detailed Marks", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  _termButton(),
                ],
              ),
            ),

            const SizedBox(height: 16),

            ListView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 24),
              children: [
                _markTile(context, "M", "Mathematics", "A", "85/100"),
                _markTile(context, "S", "Science", "A+", "92/100"),
                _markTile(context, "E", "English", "B+", "78/100"),
                _markTile(context, "H", "History", "A", "88/100"),
                _markTile(context, "C", "Computer Sci.", "A+", "95/100"),
                _markTile(context, "A", "Arts & Crafts", "B", "82/100"),
              ],
            ),
            
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _statBox(BuildContext context, String label, String value) {
    final theme = Theme.of(context);
    return Container(
      width: 100,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface, 
        borderRadius: BorderRadius.circular(20), 
        border: Border.all(color: theme.dividerColor.withOpacity(0.05))
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 10, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
      ]),
    );
  }

  Widget _bar(double height, String label) {
    return Column(
      children: [
        Container(
          width: 20,
          height: height,
          decoration: BoxDecoration(color: const Color(0xFF5A5FF3), borderRadius: BorderRadius.circular(4)),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textLight)),
      ],
    );
  }

  Widget _termButton() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(color: const Color(0xFF5A5FF3), borderRadius: BorderRadius.circular(10)),
      child: const Row(children: [Icon(LucideIcons.check, color: Colors.white, size: 12), SizedBox(width: 8), Text("Term 2", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold))]),
    );
  }

  Widget _markTile(BuildContext context, String initial, String subject, String grade, String score) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface, 
        borderRadius: BorderRadius.circular(20), 
        border: Border.all(color: theme.dividerColor.withOpacity(0.05))
      ),
      child: Row(
        children: [
          Container(width: 40, height: 40, decoration: BoxDecoration(color: theme.scaffoldBackgroundColor, borderRadius: BorderRadius.circular(10)), child: Center(child: Text(initial, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)))),
          const SizedBox(width: 16),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(subject, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            Text("Grade: $grade", style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
          ])),
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Text(score, style: const TextStyle(fontWeight: FontWeight.bold)),
            const Text("Pass", style: TextStyle(color: Colors.green, fontSize: 8, fontWeight: FontWeight.bold)),
          ]),
        ],
      ),
    );
  }
}