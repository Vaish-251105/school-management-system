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
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchSalaries();
  }

  Future<void> _fetchSalaries() async {
    setState(() => _isLoading = true);
    final salaries = await ApiService.getSalaries();
    setState(() {
      _salaries = salaries;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Payroll Management"),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: _salaries.length,
            itemBuilder: (context, index) {
              final salary = _salaries[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: ListTile(
                  leading: const CircleAvatar(backgroundColor: Colors.green, child: Icon(LucideIcons.banknote, color: Colors.white)),
                  title: Text(salary['staffId']?['name'] ?? "Staff member", style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text("Amount: ₹${salary['amount']} • Status: ${salary['status']}"),
                  trailing: (salary['status'] == 'Pending') 
                    ? ElevatedButton(
                        onPressed: () {}, // Pay logic
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.black, foregroundColor: Colors.white, textStyle: const TextStyle(fontSize: 10)),
                        child: const Text("PAY NOW"),
                      )
                    : const Icon(LucideIcons.checkCircle, color: Colors.green),
                ),
              );
            },
          ),
    );
  }
}
