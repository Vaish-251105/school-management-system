import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class TimetableScreen extends StatefulWidget {
  const TimetableScreen({super.key});

  @override
  State<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> {
  String _selectedClass = "10";
  bool _isLoading = true;
  List<dynamic> _periods = [];
  final List<String> _classes = ["8", "9", "10", "11", "12"];
  final List<String> _days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
  String _activeDay = "MON";

  @override
  void initState() {
    super.initState();
    _loadTimetable();
  }

  Future<void> _loadTimetable() async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiService.getTimetableByClass(_selectedClass);
      if (mounted) {
        setState(() {
          _periods = res.isNotEmpty ? res[0]['periods'] : [];
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final userRole = context.watch<AuthService>().role;
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
          _buildClassSelector(),
          _buildDayPicker(),
          Expanded(
            child: _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : _periods.isEmpty 
                ? const Center(child: Text("No classes scheduled yet"))
                : ListView.builder(
                    padding: const EdgeInsets.all(24),
                    itemCount: _periods.length,
                    itemBuilder: (context, index) {
                      final p = _periods[index];
                      return _classTile(
                        context, 
                        p['startTime'] ?? "--", 
                        p['subject'] ?? "General", 
                        "Advanced Study", 
                        p['room'] ?? "Room 101", 
                        Colors.indigo
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: (userRole == 'teacher' || userRole == 'admin') 
        ? FloatingActionButton.extended(
            onPressed: () => _showEditDialog(),
            backgroundColor: AppColors.primary,
            icon: const Icon(LucideIcons.edit3, color: Colors.white),
            label: const Text("Edit Schedule", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          )
        : null,
    );
  }

  Widget _buildClassSelector() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Row(
        children: [
          const Text("Select Class: ", style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(width: 12),
          DropdownButton<String>(
            value: _selectedClass,
            items: _classes.map((c) => DropdownMenuItem(value: c, child: Text("Grade $c"))).toList(),
            onChanged: (val) {
              if (val != null) {
                setState(() => _selectedClass = val);
                _loadTimetable();
              }
            },
          )
        ],
      ),
    );
  }

  Widget _buildDayPicker() {
    return Container(
      height: 70,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: _days.length,
        itemBuilder: (context, index) {
          final d = _days[index];
          final isSelected = _activeDay == d;
          return GestureDetector(
            onTap: () => setState(() => _activeDay = d),
            child: Container(
              margin: const EdgeInsets.only(right: 12),
              width: 60,
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : Colors.transparent, 
                borderRadius: BorderRadius.circular(16), 
                border: Border.all(color: isSelected ? AppColors.primary : AppColors.border.withOpacity(0.1))
              ),
              child: Center(
                child: Text(d, style: TextStyle(color: isSelected ? Colors.white : AppColors.textLight, fontSize: 11, fontWeight: FontWeight.bold))
              ),
            ),
          );
        },
      ),
    );
  }

  void _showEditDialog() {
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Table editor coming in next update... (API ready)")));
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
          Container(width: 8, height: 50, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(4))),
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