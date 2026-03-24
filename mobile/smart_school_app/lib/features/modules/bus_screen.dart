import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';

class BusScreen extends StatefulWidget {
  const BusScreen({super.key});

  @override
  State<BusScreen> createState() => _BusScreenState();
}

class _BusScreenState extends State<BusScreen> {
  bool _isTracking = true;

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
              gradient: LinearGradient(colors: [Color(0xFF10B981), Color(0xFF065F46)]),
              borderRadius: BorderRadius.only(bottomLeft: Radius.circular(40), bottomRight: Radius.circular(40)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft, color: Colors.white)),
                    const Text("Transit Intelligence", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    _statusBadge("LIVE"),
                  ],
                ),
                const SizedBox(height: 32),
                const Text("ROUTE 04 - NORTHERN SECTOR", style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                const SizedBox(height: 6),
                const Text("ETA: 14 Minutes", style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(24),
              children: [
                /// MOCK MAP VIEW
                Container(
                  height: 300,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: isDark ? Colors.black26 : Colors.blueGrey[50],
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(color: theme.dividerColor.withOpacity(0.05)),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20)],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(32),
                    child: Stack(
                      children: [
                        // Grid Background (Mock map tiles)
                        GridView.builder(
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 5),
                          itemBuilder: (c, i) => Container(border: Border.all(color: Colors.white.withOpacity(0.1))),
                        ),
                        // Roads mockup
                        Center(
                          child: Container(width: 40, height: 300, color: Colors.grey.withOpacity(0.2)),
                        ),
                        Center(
                          child: Container(width: 300, height: 40, color: Colors.grey.withOpacity(0.2)),
                        ),
                        // Bus Marker
                        AnimatedPositioned(
                          duration: const Duration(seconds: 2),
                          top: 150, left: 140,
                          child: Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 4)]),
                                child: const Text("MH-12-AX-4501", style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.black)),
                              ),
                              const Icon(LucideIcons.bus, color: Colors.green, size: 36),
                            ],
                          ),
                        ),
                        // User Marker
                        const Positioned(
                          top: 50, right: 60,
                          child: Icon(LucideIcons.mapPin, color: Colors.red, size: 28),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                
                Text("Operational Status", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : AppColors.textDark)),
                const SizedBox(height: 16),
                _infoTile(context, LucideIcons.user, "Designated Pilot", "Mr. David Miller", "Verified"),
                _infoTile(context, LucideIcons.bus, "Vehicle Class", "Tata Marcopolo 42S", "AC-E4"),
                _infoTile(context, LucideIcons.navigation, "Next Station", "Green Valley Square", "2.4 km"),
                
                const SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => setState(() => _isTracking = !_isTracking),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isTracking ? Colors.redAccent.withOpacity(0.1) : Colors.green.withOpacity(0.1),
                      side: BorderSide(color: _isTracking ? Colors.redAccent : Colors.green),
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                    icon: Icon(_isTracking ? LucideIcons.stopCircle : LucideIcons.playCircle, color: _isTracking ? Colors.redAccent : Colors.green),
                    label: Text(_isTracking ? "Disable Real-time Sync" : "Enable Tracking", style: TextStyle(color: _isTracking ? Colors.redAccent : Colors.green, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _statusBadge(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          const CircleAvatar(radius: 3, backgroundColor: Colors.white),
          const SizedBox(width: 6),
          Text(label, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _infoTile(BuildContext context, IconData icon, String label, String value, String tag) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.05) : Colors.white, 
        borderRadius: BorderRadius.circular(24), 
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: Colors.green, size: 20)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label, style: const TextStyle(color: Colors.grey, fontSize: 11)),
              Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            ]),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: Colors.grey.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
            child: Text(tag, style: const TextStyle(color: Colors.grey, fontSize: 9, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}