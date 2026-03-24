import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';

class ExamResultsScreen extends StatefulWidget {
  const ExamResultsScreen({super.key});

  @override
  State<ExamResultsScreen> createState() => _ExamResultsScreenState();
}

class _ExamResultsScreenState extends State<ExamResultsScreen> {
  List<dynamic> _exams = [];
  bool _isLoading = false;
  String _selectedTerm = "Q1";
  List<String> _terms = ["Q1", "Q2", "Q3", "Q4"];

  @override
  void initState() {
    super.initState();
    _loadExams();
  }

  Future<void> _loadExams() async {
    setState(() => _isLoading = true);
    try {
      final exams = await ApiService.get("exams?term=$_selectedTerm");
      if (mounted) {
        setState(() {
          _exams = exams is List ? exams : (exams is Map && exams['data'] is List ? exams['data'] : []);
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e"), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;
    final isTablet = MediaQuery.of(context).size.width >= 600 && MediaQuery.of(context).size.width < 1024;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft)),
        title: const Text("Exam Results", style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(isMobile ? 16 : 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Term Selector
                    _buildTermSelector(),
                    const SizedBox(height: 24),

                    // Exams Grid or List
                    if (_exams.isEmpty)
                      Center(
                        child: Column(
                          children: [
                            Icon(LucideIcons.clipboardList, size: 64, color: Colors.grey[400]),
                            const SizedBox(height: 16),
                            Text(
                              "No exams found for $_selectedTerm",
                              style: TextStyle(color: Colors.grey[600], fontSize: 16),
                            ),
                          ],
                        ),
                      )
                    else
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Exams (${_exams.length})",
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          if (isMobile)
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _exams.length,
                              itemBuilder: (_, i) => _buildExamCard(_exams[i]),
                            )
                          else if (isTablet)
                            GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                mainAxisSpacing: 16,
                                crossAxisSpacing: 16,
                                childAspectRatio: 1.1,
                              ),
                              itemCount: _exams.length,
                              itemBuilder: (_, i) => _buildExamCard(_exams[i]),
                            )
                          else
                            GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 3,
                                mainAxisSpacing: 16,
                                crossAxisSpacing: 16,
                                childAspectRatio: 1.2,
                              ),
                              itemCount: _exams.length,
                              itemBuilder: (_, i) => _buildExamCard(_exams[i]),
                            ),
                        ],
                      ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildTermSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: PopupMenuButton<String>(
        initialValue: _selectedTerm,
        onSelected: (value) => setState(() {
          _selectedTerm = value;
          _loadExams();
        }),
        itemBuilder: (context) => _terms
            .map((term) => PopupMenuItem(
                  value: term,
                  child: Text(term),
                ))
            .toList(),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(LucideIcons.filter, size: 20, color: AppColors.primary),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Select Term", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 4),
                    Text(_selectedTerm, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 16)),
                  ],
                ),
              ],
            ),
            Icon(LucideIcons.chevronDown, size: 20, color: AppColors.primary),
          ],
        ),
      ),
    );
  }

  Widget _buildExamCard(dynamic exam) {
    final subject = exam['subject'] ?? "Exam";
    final date = exam['date'] ?? exam['examDate'] ?? "";
    final status = exam['status'] ?? "Completed";
    final id = exam['_id'] ?? "";

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: InkWell(
        onTap: () => _showExamDetail(exam),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      subject,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: status == "Completed" ? Colors.green.withOpacity(0.2) : Colors.orange.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      status,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: status == "Completed" ? Colors.green : Colors.orange,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(LucideIcons.calendar, size: 14, color: AppColors.textLight),
                  const SizedBox(width: 6),
                  Text(
                    _formatDate(date),
                    style: const TextStyle(fontSize: 12, color: AppColors.textLight),
                  ),
                ],
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => _showExamDetail(exam),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text(
                    "View Details",
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showExamDetail(dynamic exam) {
    final subject = exam['subject'] ?? "Exam";
    final totalMarks = exam['totalMarks'] ?? 100;
    final results = exam['results'] is List ? exam['results'] : [];

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(subject),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatItem("Total Marks", "$totalMarks"),
                    _buildStatItem("Students", "${results.length}"),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              if (results.isNotEmpty) ...[
                const Text("Results", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 12),
                ...results.asMap().entries.map<Widget>((e) {
                  final result = e.value;
                  final name = result['studentName'] ?? "Student ${e.key + 1}";
                  final marks = result['marks'] ?? 0;
                  final percentage = ((marks / totalMarks) * 100).toStringAsFixed(1);
                  return ListTile(
                    dense: true,
                    title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
                    trailing: Text("$marks/$totalMarks ($percentage%)", style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                  );
                }).toList(),
              ] else
                const Text("No results yet"),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Close")),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.primary)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textLight)),
      ],
    );
  }

  String _formatDate(dynamic dateStr) {
    try {
      if (dateStr is String && dateStr.isNotEmpty) {
        final date = DateTime.parse(dateStr);
        return DateFormat('dd MMM yyyy').format(date);
      }
    } catch (e) {
      //
    }
    return "Unknown";
  }
}
