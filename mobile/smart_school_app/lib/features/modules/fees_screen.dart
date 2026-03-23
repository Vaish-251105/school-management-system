import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';

class FeesScreen extends StatelessWidget {
  const FeesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: const Color(0xFF4F46E5),
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft, color: Colors.white)),
        title: const Text("Fees & Payments", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [IconButton(onPressed: () {}, icon: const Icon(LucideIcons.moreVertical, color: Colors.white))],
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // TOTAL COLLECTION HEADER
            Container(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
              decoration: const BoxDecoration(
                color: Color(0xFF4F46E5),
                borderRadius: BorderRadius.only(bottomLeft: Radius.circular(40), bottomRight: Radius.circular(40)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Total Collection", style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Text("\$42,500.00", style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(20)),
                        child: const Row(children: [Icon(LucideIcons.trendingUp, color: Colors.white, size: 10), SizedBox(width: 4), Text("+12.5%", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold))]),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(child: _miniStat("Received", "\$38,200")),
                      Container(width: 1, height: 30, color: Colors.white24),
                      Expanded(child: _miniStat("Pending", "\$4,300")),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // FILTERS
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _filterChip(context, "All Fees", true),
                  _filterChip(context, "Tuition", false),
                  _filterChip(context, "Transport", false),
                  _filterChip(context, "Examination", false),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // TRANSACTIONS
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Recent Transactions", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: isDark ? Colors.white : AppColors.textDark)),
                  TextButton(onPressed: () {}, child: Text("See All", style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold))),
                ],
              ),
            ),

            ListView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.all(24),
              children: [
                _feeCard(context, "Tuition Fee - Grade 10-A", context.watch<AuthService>().name, "Oct 15, 2023", "\$1,200.00", "Paid"),
                _feeCard(context, "Bus Fee - Route 04", context.watch<AuthService>().name, "Oct 20, 2023", "\$150.00", "Pending"),
              ],
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Processing Fee Collection..."))),
        backgroundColor: theme.primaryColor,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text("Collect Fee", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _miniStat(String label, String value) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11)),
      Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
    ]);
  }

  Widget _filterChip(BuildContext context, String label, bool isSelected) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? theme.primaryColor : (isDark ? Colors.white10 : Colors.white),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isSelected ? theme.primaryColor : theme.dividerColor.withOpacity(0.1)),
      ),
      child: Center(child: Text(label, style: TextStyle(color: isSelected ? Colors.white : (isDark ? Colors.white70 : AppColors.textLight), fontWeight: FontWeight.bold, fontSize: 13))),
    );
  }

  Widget _feeCard(BuildContext context, String title, String student, String date, String amount, String status) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    bool isPaid = status == "Paid";

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text("Student: $student", style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
              ])),
              Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: (isPaid ? Colors.green : Colors.orange).withOpacity(0.1), borderRadius: BorderRadius.circular(8)), child: Text(status, style: TextStyle(color: isPaid ? Colors.green : Colors.orange, fontSize: 9, fontWeight: FontWeight.bold))),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text("Due Date", style: TextStyle(color: AppColors.textLight, fontSize: 10)),
                Text(date, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              ]),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                const Text("Amount", style: TextStyle(color: AppColors.textLight, fontSize: 10)),
                Text(amount, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: theme.primaryColor)),
              ]),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(child: _actionButton(context, LucideIcons.bell, "Send Reminder", Colors.indigo.withOpacity(0.1), Colors.indigo)),
              const SizedBox(width: 12),
              Expanded(child: _actionButton(context, LucideIcons.checkCircle, "Mark Paid", theme.primaryColor.withOpacity(0.1), theme.primaryColor)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _actionButton(BuildContext context, IconData icon, String label, Color bg, Color fg) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(icon, size: 14, color: fg), const SizedBox(width: 8), Text(label, style: TextStyle(color: fg, fontSize: 11, fontWeight: FontWeight.bold))]),
    );
  }
}