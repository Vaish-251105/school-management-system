import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';

class FeesPaymentsScreen extends StatelessWidget {
  const FeesPaymentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            /// HEADER
            Container(
              padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 24),
              decoration: const BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                      const Text("Fees & Payments", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      const Icon(Icons.more_vert, color: Colors.white, size: 24),
                    ],
                  ),
                  const SizedBox(height: 30),

                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withOpacity(0.2)),
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
                                Text("Total Collection", style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12)),
                                const SizedBox(height: 4),
                                const Text("\$42,500.00", style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                children: const [
                                  Icon(Icons.trending_up, color: Colors.white, size: 14),
                                  SizedBox(width: 4),
                                  Text("+12.5%", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            )
                          ],
                        ),
                        
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 16),
                          child: Divider(color: Colors.white24, height: 1),
                        ),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("Received", style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11)),
                                const Text("\$38,200", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                              ],
                            ),
                            Container(width: 1, height: 30, color: Colors.white24),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("Pending", style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11)),
                                const Text("\$4,300", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ],
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),

            const SizedBox(height: 24),

            /// CHIPS
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  _buildChip("All Fees", true),
                  _buildChip("Tuition", false),
                  _buildChip("Transport", false),
                  _buildChip("Examination", false),
                ],
              ),
            ),
            const SizedBox(height: 24),

            /// RECENT TRANSACTIONS HEADER
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Recent Transactions", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.textDark)),
                  TextButton(onPressed: (){}, child: const Text("See All", style: TextStyle(color: AppColors.primary, fontSize: 13))),
                ],
              ),
            ),

            /// FEE CARDS
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  _buildFeeCard("Tuition Fee - Grade 10-A", "Student: Alex Johnson", "Oct 15, 2023", "\$1,200.00", "Paid", true, false),
                  _buildFeeCard("Bus Fee - Route 04", "Student: Sarah Williams", "Oct 20, 2023", "\$150.00", "Pending", false, true),
                  
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    child: Row(
                      children: [
                        CircleAvatar(backgroundColor: Color(0xFFE0E7FF), radius: 14, child: Text("SW", style: TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold))),
                        SizedBox(width: 12),
                        Text("Sarah Williams's Fees", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
                      ],
                    ),
                  ),

                  _buildFeeCard("Quarterly Tuition", "Term 2 (2023-24)", "Nov 05, 2023", "\$850.00", "Pending", false, true),
                  _buildFeeCard("Lab & Library Charges", "Annual 2023", "Sep 10, 2023", "\$200.00", "Paid", true, false),
                  _buildFeeCard("Sports Kit Fee", "One-time payment", "Aug 15, 2023", "\$75.00", "Overdue", false, true),

                  /// INSIGHTS WIDGET
                  Container(
                    margin: const EdgeInsets.only(top: 16, bottom: 80),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primary.withOpacity(0.1)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(10)),
                          child: const Icon(Icons.bar_chart, color: Colors.white, size: 20),
                        ),
                        const SizedBox(width: 16),
                        Expanded(child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text("Financial Insights", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                            Text("Your monthly revenue report is ready.", style: TextStyle(color: AppColors.textLight, fontSize: 12)),
                          ],
                        )),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                          child: const Icon(Icons.arrow_forward, color: AppColors.primary, size: 16),
                        ),
                      ],
                    ),
                  )
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
        label: const Text("Collect Fee", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildChip(String label, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary : Colors.white,
        border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          if (isSelected) const Icon(Icons.check, color: Colors.white, size: 16),
          if (isSelected) const SizedBox(width: 4),
          Text(label, style: TextStyle(color: isSelected ? Colors.white : AppColors.textDark, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildFeeCard(String title, String subtitle, String date, String amount, String status, bool isPaid, bool showPay) {
    
    Color badgeBg = AppColors.background;
    Color badgeText = AppColors.textDark;
    
    if (status == "Paid") {
      badgeBg = Colors.green.withOpacity(0.1);
      badgeText = Colors.green;
    } else if (status == "Pending") {
      badgeBg = Colors.grey.withOpacity(0.1);
      badgeText = Colors.black87;
    } else if (status == "Overdue") {
      badgeBg = Colors.transparent;
      badgeText = Colors.black87; 
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.01), blurRadius: 10, offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
                    const SizedBox(height: 2),
                    Text(subtitle, style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: badgeBg, borderRadius: BorderRadius.circular(10)),
                child: Text(status, style: TextStyle(color: badgeText, fontWeight: FontWeight.bold, fontSize: 10)),
              )
            ],
          ),
          
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Divider(color: AppColors.border, height: 1),
          ),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Due Date", style: TextStyle(color: AppColors.textLight, fontSize: 11)),
                  Text(date, style: const TextStyle(color: AppColors.textDark, fontSize: 15, fontWeight: FontWeight.w500)),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text("Amount", style: TextStyle(color: AppColors.textLight, fontSize: 11)),
                  Text(amount, style: const TextStyle(color: AppColors.primary, fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),

          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.notifications_active, color: AppColors.primary, size: 14),
                      SizedBox(width: 4),
                      Text("Send Reminder", style: TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(10)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.check_circle, color: Colors.white, size: 14),
                      SizedBox(width: 4),
                      Text("Mark Paid", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              )
            ],
          ),

          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(10)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.download, color: AppColors.textLight, size: 14),
                      SizedBox(width: 4),
                      Text("Receipt", style: TextStyle(color: AppColors.textLight, fontSize: 12, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ),
              if (showPay) ...[
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(color: Colors.green.shade800, borderRadius: BorderRadius.circular(10)),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.payments, color: Colors.white, size: 14),
                        SizedBox(width: 4),
                        Text("Pay Now", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                )
              ] else ...[
                 const SizedBox(width: 12),
                 Expanded(child: Container()) // empty space to align button
              ]
            ],
          )

        ],
      ),
    );
  }
}
