import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';

class BusScreen extends StatelessWidget {
  const BusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(24, 60, 24, 30),
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [Color(0xFF10B981), Color(0xFF059669)]),
              borderRadius: BorderRadius.only(bottomLeft: Radius.circular(40), bottomRight: Radius.circular(40)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft, color: Colors.white)),
                    const Text("Bus Tracking", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    const Icon(LucideIcons.map, color: Colors.white),
                  ],
                ),
                const SizedBox(height: 32),
                const Text("Route No. 04", style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                const Text("Arriving in 12 mins", style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(24),
              children: [
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface, 
                    borderRadius: BorderRadius.circular(30), 
                    border: Border.all(color: theme.dividerColor.withOpacity(0.05))
                  ),
                  child: const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.mapPin, color: Colors.green, size: 32),
                        SizedBox(height: 12),
                        Text("Simulated Map View", style: TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                Text("Bus Information", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                const SizedBox(height: 16),
                _busInfoTile(context, LucideIcons.bus, "Plate Number", "XYZ-9870"),
                _busInfoTile(context, LucideIcons.user, "Driver Name", "Robert Fox"),
                _busInfoTile(context, LucideIcons.phone, "Contact", "+1 234 567 890"),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _busInfoTile(BuildContext context, IconData icon, String label, String value) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

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
          Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: theme.primaryColor.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: theme.primaryColor, size: 18)),
          const SizedBox(width: 16),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
            Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
          ]),
        ],
      ),
    );
  }
}