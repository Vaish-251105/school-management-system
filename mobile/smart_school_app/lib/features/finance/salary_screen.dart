import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class SalaryScreen extends StatefulWidget {
  const SalaryScreen({super.key});

  @override
  State<SalaryScreen> createState() => _SalaryScreenState();
}

class _SalaryScreenState extends State<SalaryScreen> {
  List<dynamic> _salaries = [];
  List<dynamic> _staff = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final staffRes = await ApiService.getStaff();
      // Simulating salaries as I don't have a full salary API yet
      // In a real app, you'd fetch from ApiService.getSalaries()
      setState(() {
        _staff = staffRes;
        _salaries = staffRes.map((s) {
          final userData = s['userId'] ?? s;
          return {
            'id': s['_id'],
            'name': userData['name'] ?? 'Staff',
            'role': userData['role'] ?? 'Staff',
            'amount': 25000 + (Math.floor(Math.random() * 15000)),
            'status': Math.random() > 0.3 ? 'paid' : 'pending',
            'month': 'March 2024'
          };
        }).toList();
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Payroll Management", style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0D9488),
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft)),
        actions: [IconButton(onPressed: _loadData, icon: const Icon(LucideIcons.refreshCw))],
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : ListView.builder(
            padding: const EdgeInsets.all(24),
            itemCount: _salaries.length,
            itemBuilder: (context, index) {
              final s = _salaries[index];
              bool isPaid = s['status'] == 'paid';
              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10)]
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: Colors.teal.withOpacity(0.1),
                      child: Text(s['name'][0], style: const TextStyle(color: Colors.teal, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          Text("${s['role'].toString().toUpperCase()} • ${s['month']}", style: const TextStyle(color: Colors.grey, fontSize: 11)),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text("₹${s['amount']}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.indigo)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: (isPaid ? Colors.green : Colors.orange).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8)
                          ),
                          child: Text(
                            isPaid ? "PAID" : "PENDING",
                            style: TextStyle(color: isPaid ? Colors.green : Colors.orange, fontSize: 9, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Processing bulk payroll for March 2024..."))),
        backgroundColor: const Color(0xFF0D9488),
        icon: const Icon(LucideIcons.zap, color: Colors.white),
        label: const Text("Process All", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }
}

class Math {
  static double random() => (DateTime.now().microsecondsSinceEpoch % 100) / 100;
  static int floor(num x) => x.floor();
}
