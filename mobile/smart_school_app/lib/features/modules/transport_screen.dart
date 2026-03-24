import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class TransportScreen extends StatefulWidget {
  const TransportScreen({super.key});

  @override
  State<TransportScreen> createState() => _TransportScreenState();
}

class _TransportScreenState extends State<TransportScreen> {
  List<dynamic> _buses = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchBuses();
  }

  Future<void> _fetchBuses() async {
    setState(() => _isLoading = true);
    final buses = await ApiService.getBuses();
    setState(() {
      _buses = buses;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("School Transport"),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : _buses.isEmpty 
          ? const Center(child: Text("No bus records found"))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _buses.length,
              itemBuilder: (context, index) {
                final bus = _buses[index];
                return Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  margin: const EdgeInsets.only(bottom: 16),
                  child: ExpansionTile(
                    leading: const CircleAvatar(backgroundColor: Color(0xFFFACC15), child: Icon(LucideIcons.bus, color: Colors.white)),
                    title: Text("Bus No: ${bus['busNumber']}", style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(bus['route'] ?? "Unknown Route"),
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            _detailRow(LucideIcons.user, "Driver", bus['driverName'] ?? "N/A"),
                            _detailRow(LucideIcons.phone, "Phone", bus['driverPhone'] ?? "N/A"),
                            _detailRow(LucideIcons.mapPin, "Status", bus['status'] ?? "Stationary"),
                            const SizedBox(height: 16),
                            // Simulated MAP Placeholder
                            Container(
                              height: 150,
                              width: double.infinity,
                              decoration: BoxDecoration(
                                color: Colors.grey[200],
                                borderRadius: BorderRadius.circular(16),
                                image: const DecorationImage(
                                  image: NetworkImage("https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-map-city-vector-set-isolated.jpg"),
                                  fit: BoxFit.cover,
                                  opacity: 0.5,
                                ),
                              ),
                              child: const Center(child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(LucideIcons.mapPin, color: Colors.red, size: 40),
                                  Text("Live Tracking...", style: TextStyle(fontWeight: FontWeight.bold)),
                                ],
                              )),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }

  Widget _detailRow(IconData icon, String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.grey),
          const SizedBox(width: 8),
          Text("$label: ", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          Text(val, style: const TextStyle(fontSize: 13)),
        ],
      ),
    );
  }
}
