import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';

class AcademicHubScreen extends StatelessWidget {
  const AcademicHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            /// HEADER
            Container(
              padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 30),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppColors.secondary, AppColors.primary],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Row(
                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
                     children: [
                       Column(
                         crossAxisAlignment: CrossAxisAlignment.start,
                         children: [
                           const Text("Academic Hub", style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
                           const SizedBox(height: 4),
                           Text("Smart School ERP • Term 1", style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13)),
                         ],
                       ),
                       Container(
                         width: 44, height: 44,
                         decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                         alignment: Alignment.center,
                         child: const Text("JD", style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 16)),
                       )
                     ],
                   ),
                   const SizedBox(height: 24),
                   
                   Container(
                     padding: const EdgeInsets.symmetric(vertical: 16),
                     decoration: BoxDecoration(
                       color: Colors.white.withOpacity(0.1),
                       borderRadius: BorderRadius.circular(16),
                       border: Border.all(color: Colors.white.withOpacity(0.2)),
                     ),
                     child: Row(
                       mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                       children: [
                         _buildHeaderStat("Attendance", "94%"),
                         _buildHeaderStat("GPA", "3.82"),
                         _buildHeaderStat("Rank", "#04"),
                       ],
                     ),
                   )
                ],
              ),
            ),
            
            const SizedBox(height: 20),

            /// CHIPS
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  _buildChip(Icons.check, "All Updates", true),
                  _buildChip(Icons.message_outlined, "Messages", false),
                  _buildChip(Icons.person_outline, "Teachers", false),
                ],
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  
                  /// IMPORTANT NOTICES
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Important Notices", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                      TextButton(onPressed: (){}, child: const Text("View Archive", style: TextStyle(color: AppColors.primary, fontSize: 13))),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primary.withOpacity(0.1)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(12)),
                          child: const Icon(Icons.campaign, color: Colors.white, size: 20),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text("Winter Break Schedule", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
                              const SizedBox(height: 4),
                              const Text("The school will remain closed from Dec 20 to Jan 5. Please ensure all library books are returned before the break.", style: TextStyle(color: AppColors.textDark, fontSize: 13, height: 1.4)),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Icon(Icons.access_time, size: 12, color: AppColors.textDark.withOpacity(0.6)),
                                  const SizedBox(width: 4),
                                  Text("Posted 2 hours ago", style: TextStyle(color: AppColors.textDark.withOpacity(0.6), fontSize: 11, fontWeight: FontWeight.bold)),
                                ],
                              )
                            ],
                          ),
                        )
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  /// YOUR INSTRUCTORS
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Your Instructors", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                      TextButton(onPressed: (){}, child: const Text("Directory", style: TextStyle(color: AppColors.primary, fontSize: 13))),
                    ],
                  ),
                  _buildInstructorCard("SJ", "Dr. Sarah Jenkins", "Advanced Mathematics", "s.jenkins@school.edu"),
                  _buildInstructorCard("MC", "Prof. Michael Chen", "Physics & Robotics", "m.chen@school.edu"),

                  const SizedBox(height: 24),

                  /// TIMETABLE
                  const Text("Today's Timetable", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                  const SizedBox(height: 16),
                  _buildTimetableCard(Colors.indigo.shade50, "Mathematics", "Calculus & Algebra", "08:30 AM", "Lab 204"),
                  _buildTimetableCard(Colors.teal.shade50, "Physics", "Quantum Mechanics", "10:15 AM", "Hall A"),

                  const SizedBox(height: 24),

                  /// PENDING ASSIGNMENTS
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Pending Assignments", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(10)),
                        child: const Text("3 Active", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildAssignmentCard("MATH", "Integrals Worksheet", "Complete all exercises from Chapter 5.2. Show all working steps clearly.", "Due: Tomorrow", "2 PDF files"),
                  _buildAssignmentCard("PHYSICS", "Lab Report: Pendulums", "Submit the digital copy of your findings from Monday's lab session.", "Due: Friday", "1 DOCX"),
                  
                  const SizedBox(height: 80),
                ],
              ),
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text("New Message", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildHeaderStat(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildChip(IconData icon, String label, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary : Colors.white,
        border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(icon, color: isSelected ? Colors.white : AppColors.textDark, size: 16),
          const SizedBox(width: 8),
          Text(label, style: TextStyle(color: isSelected ? Colors.white : AppColors.textDark, fontSize: 13, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildInstructorCard(String init, String name, String sub, String email) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(color: AppColors.background, shape: BoxShape.circle),
            alignment: Alignment.center,
            child: Text(init, style: const TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                const SizedBox(height: 2),
                Text(sub, style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 2),
                Row(
                  children: [
                    const Icon(Icons.email, size: 10, color: AppColors.textLight),
                    const SizedBox(width: 4),
                    Text(email, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
                  ],
                )
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), shape: BoxShape.circle),
            child: const Icon(Icons.chat_bubble, color: AppColors.primary, size: 18),
          )
        ],
      ),
    );
  }

  Widget _buildTimetableCard(Color color, String sub, String topic, String time, String room) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 48, height: 48,
            decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(sub, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                const SizedBox(height: 2),
                Text(topic, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(time, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.textDark)),
              const SizedBox(height: 4),
              Text(room, style: const TextStyle(color: AppColors.textLight, fontSize: 11)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildAssignmentCard(String tag, String title, String desc, String due, String files) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: tag == "MATH" ? Colors.blue.withOpacity(0.1) : Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                child: Text(tag, style: TextStyle(color: tag == "MATH" ? Colors.blue : Colors.green, fontWeight: FontWeight.bold, fontSize: 10)),
              ),
              Row(
                children: [
                  const Icon(Icons.access_time, size: 12, color: Colors.red),
                  const SizedBox(width: 4),
                  Text(due, style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 11)),
                ],
              )
            ],
          ),
          const SizedBox(height: 16),
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
                  const Icon(Icons.attach_file, size: 14, color: AppColors.textLight),
                  const SizedBox(width: 4),
                  Text(files, style: const TextStyle(color: AppColors.textLight, fontSize: 11, fontWeight: FontWeight.bold)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(20)),
                child: const Text("Submit Task", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
              )
            ],
          )
        ],
      ),
    );
  }
}
