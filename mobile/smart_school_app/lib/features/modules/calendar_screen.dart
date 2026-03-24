import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';

class AcademicCalendarScreen extends StatefulWidget {
  const AcademicCalendarScreen({super.key});

  @override
  State<AcademicCalendarScreen> createState() => _AcademicCalendarScreenState();
}

class _AcademicCalendarScreenState extends State<AcademicCalendarScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text("Academic Calendar", style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.textDark,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          children: [
            // CALENDAR GRID SIMULATION
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(30),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 20, offset: const Offset(0, 8))
                ],
              ),
              child: Column(
                children: [
                   Row(
                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
                     children: [
                       const Text("October 2024", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                       Row(
                         children: [
                            IconButton(onPressed: () {}, icon: const Icon(LucideIcons.chevronLeft, size: 20)),
                            IconButton(onPressed: () {}, icon: const Icon(LucideIcons.chevronRight, size: 20)),
                         ],
                       ),
                     ],
                   ),
                   const SizedBox(height: 20),
                   _buildDaysHeader(),
                   const SizedBox(height: 16),
                   _buildCalendarGrid(),
                ],
              ),
            ),
            const SizedBox(height: 32),
            _buildEventSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildDaysHeader() {
    final days = ["S", "M", "T", "W", "T", "F", "S"];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: days.map((d) => SizedBox(
        width: 32,
        child: Text(d, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textLight, fontSize: 13)),
      )).toList(),
    );
  }

  Widget _buildCalendarGrid() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7, crossAxisSpacing: 8, mainAxisSpacing: 16),
      itemCount: 31,
      itemBuilder: (context, index) {
        final day = index + 1;
        bool isToday = day == 24;
        bool hasEvent = [15, 24, 28].contains(day);
        return Column(
          children: [
            Container(
              decoration: BoxDecoration(
                color: isToday ? AppColors.primary : Colors.transparent,
                shape: BoxShape.circle,
                border: Border.all(color: isToday ? AppColors.primary : Colors.transparent),
                boxShadow: isToday ? [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4))] : [],
              ),
              padding: const EdgeInsets.all(8),
              child: Text(day.toString(), style: TextStyle(color: isToday ? Colors.white : AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 13)),
            ),
            if (hasEvent && !isToday)
               Container(margin: const EdgeInsets.only(top: 4), width: 4, height: 4, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle)),
          ],
        );
      },
    );
  }

  Widget _buildEventSection() {
     return Column(
       crossAxisAlignment: CrossAxisAlignment.start,
       children: [
          Row(
            children: [
               Container(width: 4, height: 20, decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(10))),
               const SizedBox(width: 8),
               const Text("Upcoming Events", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark)),
            ],
          ),
          const SizedBox(height: 20),
          _EventItem("Oct 24", "Maths Olympiad", "09:00 AM", Colors.blue),
          _EventItem("Oct 28", "Sports Day Pre-Match", "10:30 AM", Colors.purple),
       ],
     );
  }
}

class _EventItem extends StatelessWidget {
  final String date;
  final String title;
  final String time;
  final Color color;
  const _EventItem(this.date, this.title, this.time, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                Text(date.split(' ')[0], style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
                Text(date.split(' ')[1], style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 4),
                Text(time, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
              ],
            ),
          ),
          Icon(LucideIcons.chevronRight, size: 16, color: AppColors.textLight.withOpacity(0.5)),
        ],
      ),
    );
  }
}
