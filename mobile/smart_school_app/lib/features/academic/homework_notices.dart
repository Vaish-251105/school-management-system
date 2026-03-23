import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';

class HomeworkNoticesScreen extends StatelessWidget {
  const HomeworkNoticesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            /// HEADER
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 40),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppColors.secondary, AppColors.primary],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(40),
                  bottomRight: Radius.circular(40),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                        child: const Icon(Icons.grid_view_rounded, color: Colors.white, size: 24),
                      ),
                      Stack(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                            child: const Icon(Icons.notifications_none, color: Colors.white, size: 24),
                          ),
                          Positioned(
                            top: 4,
                            right: 4,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                              child: const Text("3", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                  const SizedBox(height: 30),
                  const Text("Academic Updates", style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.school, color: Colors.white70, size: 16),
                      SizedBox(width: 6),
                      Text("Class 10-A • Term 2", style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
                    ],
                  )
                ],
              ),
            ),

            /// BODY CONTENT
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// HOMEWORK HEADER
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Active Homework", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                      TextButton(onPressed: (){}, child: const Text("View All", style: TextStyle(color: AppColors.primary, fontSize: 13))),
                    ],
                  ),
                  
                  _buildHomeworkCard("Mathematics", "Due: Oct 28", "Quadratic Equations", "Complete exercises 4.2 to 4.5 from the NCERT textbook. Focus on the factorization method.", "Dr. Smith", "Pending", Colors.orange),
                  _buildHomeworkCard("Physics", "Due: Oct 29", "Refraction Lab Report", "Submit the lab observations for the glass slab experiment performed on Tuesday.", "Prof. Wilson", "Submitted", Colors.green.shade800),
                  _buildHomeworkCard("History", "Due: Nov 02", "The French Revolution", "Write a 500-word essay on the impact of the Storming of the Bastille on the common folk.", "Ms. Garcia", "Pending", Colors.orange),

                  const SizedBox(height: 24),

                  /// QUICK LINKS
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildQuickLink(Icons.download, "Syllabus"),
                      _buildQuickLink(Icons.access_time, "Timetable"),
                      _buildQuickLink(Icons.description, "Resources"),
                    ],
                  ),

                  const SizedBox(height: 32),

                  /// RECENT NOTICES
                  const Text("Recent Notices", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                  const SizedBox(height: 16),

                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.primary.withOpacity(0.1)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: const [
                              Icon(Icons.campaign, color: AppColors.primary, size: 20),
                              SizedBox(width: 8),
                              Text("School Announcements", style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 15)),
                            ],
                          ),
                        ),
                        Container(color: AppColors.primary.withOpacity(0.1), height: 1),
                        
                        _buildNoticeItem(Icons.event, Colors.blue, "Event", "Annual Sports Meet 2024", "Registrations for the annual sports track events are now open. Visit the PE depart...", "2h ago"),
                        const Divider(height: 1),
                        _buildNoticeItem(Icons.warning_amber, Colors.red, "Urgent", "Winter Uniform Update", "Starting next Monday, all students must wear the full winter uniform including the...", "5h ago"),
                        const Divider(height: 1),
                        _buildNoticeItem(Icons.payments, Colors.green, "Fees", "Quarterly Fee Reminder", "The deadline for Q3 fee payment is Nov 5th. Please ignore if already paid.", "1d ago"),
                        const Divider(height: 1),
                        _buildNoticeItem(Icons.school, AppColors.primary, "Academic", "Parent-Teacher Meeting", "The monthly PTM is scheduled for Saturday, Nov 4th from 9:00 AM to 1:00 ...", "2d ago"),
                      ],
                    ),
                  ),

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text("Submit Homework", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildHomeworkCard(String subject, String due, String title, String desc, String teacher, String status, Color statusColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(subject, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 11)),
              Text(due, style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
          const SizedBox(height: 8),
          Text(desc, style: const TextStyle(color: AppColors.textLight, fontSize: 13, height: 1.4)),
          
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Divider(color: AppColors.border, height: 1),
          ),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.person_outline, size: 14, color: AppColors.textLight),
                  const SizedBox(width: 4),
                  Text(teacher, style: const TextStyle(color: AppColors.textLight, fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: status == "Submitted" ? statusColor : statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    if(status == "Pending") Icon(Icons.check, size: 12, color: statusColor),
                    if(status == "Pending") const SizedBox(width: 4),
                    Text(status, style: TextStyle(color: status == "Submitted" ? Colors.white : statusColor, fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  Widget _buildQuickLink(IconData icon, String label) {
    return Container(
      width: 100,
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(height: 10),
          Text(label, style: const TextStyle(color: AppColors.textDark, fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildNoticeItem(IconData icon, Color iconColor, String tag, String title, String desc, String time) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: AppColors.border),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(tag, style: TextStyle(color: iconColor, fontSize: 10, fontWeight: FontWeight.bold)),
                    Text(time, style: const TextStyle(color: AppColors.textLight, fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 4),
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                const SizedBox(height: 4),
                Text(desc, style: const TextStyle(color: AppColors.textLight, fontSize: 13, height: 1.4)),
              ],
            ),
          )
        ],
      ),
    );
  }
}
