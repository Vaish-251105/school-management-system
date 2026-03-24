import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class ExamResultsScreen extends StatefulWidget {
  const ExamResultsScreen({super.key});

  @override
  State<ExamResultsScreen> createState() => _ExamResultsScreenState();
}

class _ExamResultsScreenState extends State<ExamResultsScreen> {
  List<dynamic> _results = [];
  bool _isLoading = true;
  double _gpa = 3.85;
  double _percentage = 89.4;
  String _rank = "4th";

  @override
  void initState() {
    super.initState();
    _loadResults();
  }

  Future<void> _loadResults() async {
    setState(() => _isLoading = true);
    final results = await ApiService.getExamResults();
    if (mounted) {
      setState(() {
        _results = results;
        // Simple logic for GPA/Percentage demo if real results exist
        if (_results.isNotEmpty) {
           _calculateStats();
        }
        _isLoading = false;
      });
    }
  }

  void _calculateStats() {
     // Placeholder calculation logic
     double totalMarks = 0;
     for (var res in _results) {
       totalMarks += (res['marks'] ?? 0);
     }
     _percentage = totalMarks / (_results.length * 100) * 100;
     _gpa = (_percentage / 100) * 4.0;
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthService>();
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text("Exam Results", style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFFF9FAFB),
        elevation: 0,
        centerTitle: true,
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.arrow_back, color: AppColors.textDark)),
        actions: [
          IconButton(onPressed: _loadResults, icon: const Icon(Icons.refresh, color: AppColors.primary)),
          const Padding(
            padding: EdgeInsets.only(right: 20),
            child: Icon(Icons.download, color: AppColors.primary),
          )
        ],
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              
              /// MAIN BANNER
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 60, height: 60,
                      decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                      alignment: Alignment.center,
                      child: Text(user.name.substring(0, 2).toUpperCase(), style: const TextStyle(color: AppColors.primary, fontSize: 20, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(user.name, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Text("ID: #STU90210 • Class 10-B", style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12)),
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                            child: const Text("Final Term Examination 2023-24", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                          )
                        ],
                      ),
                    )
                  ],
                ),
              ),

              const SizedBox(height: 20),

              /// STATS ROW
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildStatCard("GPA", _gpa.toStringAsFixed(2), "/ 4.0"),
                  _buildStatCard("Percentage", _percentage.toStringAsFixed(1), "%"),
                  _buildStatCard("Rank", _rank, "/ 45"),
                ],
              ),

              const SizedBox(height: 24),

              /// BAR CHART AREA
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Subject Wise Analysis", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
                    const SizedBox(height: 30),
                    if (_results.isEmpty)
                       const Center(child: Text("No subject data available"))
                    else
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: _results.take(6).map((r) => _buildChartBar(r['subject']?.substring(0, 3) ?? "Sub", (r['marks'] ?? 0).toDouble())).toList(),
                      )
                  ],
                ),
              ),

              const SizedBox(height: 24),

              /// DETAILED MARKS HEADER
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Detailed Marks", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(8)),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.check, color: Colors.white, size: 14),
                        SizedBox(width: 4),
                        Text("Term 2", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                      ],
                    ),
                  )
                ],
              ),
              const SizedBox(height: 16),

              /// DETAILED MARKS LIST
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: _results.isEmpty 
                    ? [const Padding(padding: EdgeInsets.all(20), child: Text("No detailed marks available"))]
                    : _results.map((r) => Column(
                        children: [
                          _buildMarkRow(
                            r['subject']?.substring(0, 1) ?? "S", 
                            r['subject'] ?? "Subject", 
                            (r['marks'] ?? 0) >= 90 ? "A+" : ((r['marks'] ?? 0) >= 80 ? "A" : "B"), 
                            (r['marks'] ?? 0).toString(), 
                            (r['marks'] ?? 0) >= 40 ? "Pass" : "Fail"
                          ),
                          const Divider(height: 1),
                        ],
                      )).toList(),
                ),
              ),

              const SizedBox(height: 24),

              /// TEACHER REMARKS
              if (context.watch<AuthService>().role == 'teacher')
                Padding(
                  padding: const EdgeInsets.only(bottom: 24),
                  child: ElevatedButton.icon(
                    onPressed: _showAddMarkDialog,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    ),
                    icon: const Icon(Icons.add_chart, color: Colors.white),
                    label: const Text("Add Subject Mark", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),

              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.chat, color: AppColors.primary, size: 16),
                        SizedBox(width: 8),
                        Text("Teacher's Remarks", style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 14)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _results.isNotEmpty 
                        ? "The student is performing well. " + (_percentage > 80 ? "Keep up the excellent work!" : "Needs more focus on core subjects.")
                        : "No remarks available yet.",
                      style: const TextStyle(color: AppColors.textDark, height: 1.5, fontSize: 13),
                    )
                  ],
                ),
              ),

              const SizedBox(height: 32),
              
              /// FULL BUTTON
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                     ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Generating digital report card...")));
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  icon: const Icon(Icons.receipt_long, color: Colors.white),
                  label: const Text("View Full Report Card", style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                ),
              )

            ],
          ),
        ),
      ),
    );
  }

  void _showAddMarkDialog() {
    final subController = TextEditingController();
    final markController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Add Exam Mark"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: subController, decoration: const InputDecoration(labelText: "Subject")),
            TextField(controller: markController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: "Marks (Out of 100)")),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              await ApiService.submitExamResult({
                "subject": subController.text,
                "marks": int.tryParse(markController.text) ?? 0,
                "studentId": "placeholder_id",
              });
              Navigator.pop(context);
              _loadResults();
            }, 
            child: const Text("Save")
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, String subValue) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 11, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                Text(subValue, style: const TextStyle(color: AppColors.textDark, fontSize: 14)),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildChartBar(String label, double heightPerc) {
    return Column(
      children: [
        Container(
          width: 30,
          height: (heightPerc / 100) * 120, // max 120px height
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(6),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(color: AppColors.textLight, fontSize: 10, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildMarkRow(String init, String sub, String grade, String marks, String status) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(color: Colors.white, border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(10)),
            alignment: Alignment.center,
            child: Text(init, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 16)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(sub, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                const SizedBox(height: 2),
                Text("Grade: $grade", style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(marks, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                  const Text("/100", style: TextStyle(color: AppColors.textDark, fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 4),
              Text(status, style: const TextStyle(color: Colors.green, fontSize: 9, fontWeight: FontWeight.bold)),
            ],
          )
        ],
      ),
    );
  }
}
