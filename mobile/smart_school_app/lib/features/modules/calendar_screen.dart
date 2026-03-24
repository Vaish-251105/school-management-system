import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../core/constants/colors.dart';

class AcademicCalendarScreen extends StatefulWidget {
  const AcademicCalendarScreen({super.key});

  @override
  State<AcademicCalendarScreen> createState() => _AcademicCalendarScreenState();
}

class _AcademicCalendarScreenState extends State<AcademicCalendarScreen> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  final Map<DateTime, List<String>> _events = {
    DateTime.utc(2024, 10, 24): ['Maths Olympiad', 'Teachers Meeting'],
    DateTime.utc(2024, 10, 28): ['Sports Day Pre-Match'],
    DateTime.utc(2024, 11, 1): ['All Saints Day (Holiday)'],
  };

  List<String> _getEventsForDay(DateTime day) {
    return _events[DateTime.utc(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text("Academic Calendar", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft)),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.cardColor,
                borderRadius: BorderRadius.circular(30),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 20, offset: const Offset(0, 8))],
              ),
              child: TableCalendar(
                firstDay: DateTime.utc(2023, 1, 1),
                lastDay: DateTime.utc(2025, 12, 31),
                focusedDay: _focusedDay,
                calendarFormat: _calendarFormat,
                selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                onDaySelected: (selectedDay, focusedDay) {
                  setState(() {
                    _selectedDay = selectedDay;
                    _focusedDay = focusedDay;
                  });
                },
                onFormatChanged: (format) {
                  setState(() {
                    _calendarFormat = format;
                  });
                },
                eventLoader: _getEventsForDay,
                calendarStyle: CalendarStyle(
                  todayDecoration: BoxDecoration(color: AppColors.primary.withOpacity(0.5), shape: BoxShape.circle),
                  selectedDecoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                  markerDecoration: const BoxDecoration(color: AppColors.secondary, shape: BoxShape.circle),
                ),
                headerStyle: const HeaderStyle(
                  formatButtonVisible: true,
                  titleCentered: true,
                  titleTextStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                ),
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(width: 4, height: 20, decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(10))),
                      const SizedBox(width: 8),
                      Text(
                        _selectedDay == null ? "Today's Events" : "Events for ${_selectedDay!.day}/${_selectedDay!.month}",
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  ...(_getEventsForDay(_selectedDay ?? DateTime.now()).isEmpty 
                    ? [const Center(child: Text("No events scheduled for this day", style: TextStyle(color: AppColors.textLight)))]
                    : _getEventsForDay(_selectedDay ?? DateTime.now()).map((event) => _EventItem(event, "Scheduled", Colors.blue))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EventItem extends StatelessWidget {
  final String title;
  final String time;
  final Color color;
  const _EventItem(this.title, this.time, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
            child: Icon(LucideIcons.calendar, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text(time, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
