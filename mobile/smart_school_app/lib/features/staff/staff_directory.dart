import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../../services/api_service.dart';
import '../profile/staff_profile.dart';

class StaffDirectoryScreen extends StatefulWidget {
  const StaffDirectoryScreen({super.key});

  @override
  State<StaffDirectoryScreen> createState() => _StaffDirectoryScreenState();
}

class _StaffDirectoryScreenState extends State<StaffDirectoryScreen> {
  List<dynamic> staffList = [];
  bool isLoading = true;
  List<dynamic> filteredStaff = [];
  String searchQuery = "";
  String activeFilter = "All Staff";

  @override
  void initState() {
    super.initState();
    _fetchStaff();
  }

  Future<void> _fetchStaff() async {
    try {
      final res = await ApiService.getStaff();
      if (mounted) {
        setState(() {
          staffList = res;
          _applyFilters();
          isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => isLoading = false);
    }
  }

  void _applyFilters() {
    setState(() {
      filteredStaff = staffList.where((s) {
        final userData = s['userId'] ?? s;
        final name = (userData['name'] ?? "").toString().toLowerCase();
        final role = (userData['role'] ?? "").toString().toLowerCase();
        final email = (userData['email'] ?? "").toString().toLowerCase();
        
        bool matchesSearch = name.contains(searchQuery.toLowerCase()) || 
                           role.contains(searchQuery.toLowerCase()) ||
                           email.contains(searchQuery.toLowerCase());
        
        bool matchesFilter = activeFilter == "All Staff" || 
                           (activeFilter == "Teachers" && role == "teacher") ||
                           (activeFilter == "Accountants" && role == "accountant") ||
                           (activeFilter == "Admin" && role == "admin");
        
        return matchesSearch && matchesFilter;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Column(
        children: [
          /// HEADER
          Container(
            padding: const EdgeInsets.only(top: 60, left: 20, right: 20, bottom: 24),
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
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.chevronLeft, color: Colors.white)),
                    const Text(
                      "Staff Directory",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Icon(LucideIcons.listFilter, color: Colors.white, size: 24),
                  ],
                ),
                const SizedBox(height: 24),
                
                /// SEARCH BAR
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.1)),
                  ),
                  child: TextField(
                    onChanged: (val) {
                      searchQuery = val;
                      _applyFilters();
                    },
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(
                      hintText: "Search staff, departments...",
                      hintStyle: TextStyle(color: Colors.white70, fontSize: 14),
                      prefixIcon: Icon(LucideIcons.search, color: Colors.white70),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          /// FILTER CHIPS
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                _buildFilterChip(context, "All Staff", activeFilter == "All Staff"),
                _buildFilterChip(context, "Teachers", activeFilter == "Teachers"),
                _buildFilterChip(context, "Admin", activeFilter == "Admin"),
                _buildFilterChip(context, "Accountants", activeFilter == "Accountants"),
              ],
            ),
          ),

          const SizedBox(height: 16),

          /// LIST VIEW
          Expanded(
            child: isLoading 
              ? const Center(child: CircularProgressIndicator())
              : filteredStaff.isEmpty 
                ? const Center(child: Text("No staff found"))
                : RefreshIndicator(
                    onRefresh: _fetchStaff,
                    child: ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      itemCount: filteredStaff.length,
                      itemBuilder: (context, index) {
                        final staff = filteredStaff[index];
                        final isTeacher = staff['userId'] != null;
                        final userData = isTeacher ? staff['userId'] : staff;
                        final name = userData['name'] ?? 'Unknown Staff';
                        final role = userData['role']?.toString().toUpperCase() ?? 'STAFF';
                        final detail = isTeacher ? (staff['subject'] ?? 'Teacher') : role;
                        
                        return GestureDetector(
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => StaffProfileScreen(staff: staff))),
                          child: _buildStaffCard(
                            context,
                            "https://ui-avatars.com/api/?name=$name&background=random",
                            name,
                            role,
                            detail,
                            isTeacher ? LucideIcons.book : LucideIcons.userCheck,
                            true,
                          ),
                        );
                      },
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddStaffDialog,
        backgroundColor: theme.primaryColor,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text("Add Staff", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  void _showAddStaffDialog() {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    String selectedRole = "teacher";

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text("Add New Staff"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: nameController, decoration: const InputDecoration(labelText: "Full Name")),
                TextField(controller: emailController, decoration: const InputDecoration(labelText: "Email")),
                TextField(controller: passwordController, decoration: const InputDecoration(labelText: "Password"), obscureText: true),
                DropdownButtonFormField<String>(
                  value: selectedRole,
                  items: const [
                    DropdownMenuItem(value: "teacher", child: Text("Teacher")),
                    DropdownMenuItem(value: "accountant", child: Text("Accountant")),
                    DropdownMenuItem(value: "admin", child: Text("Admin")),
                  ],
                  onChanged: (val) => setDialogState(() => selectedRole = val!),
                  decoration: const InputDecoration(labelText: "Role"),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
            ElevatedButton(
              onPressed: () async {
                final res = await ApiService.register(
                  nameController.text,
                  emailController.text,
                  passwordController.text,
                  selectedRole
                );
                if (res['error'] == null) {
                  Navigator.pop(context);
                  _fetchStaff();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['error'])));
                }
              }, 
              child: const Text("Add")
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(BuildContext context, String label, bool isSelected) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return GestureDetector(
      onTap: () {
        activeFilter = label;
        _applyFilters();
      },
      child: Container(
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? theme.primaryColor : (isDark ? Colors.white10 : Colors.white),
          border: Border.all(color: isSelected ? theme.primaryColor : theme.dividerColor.withOpacity(0.1)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : (isDark ? Colors.white70 : AppColors.textLight),
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            fontSize: 13,
          ),
        ),
      ),
    );
  }

  Widget _buildStaffCard(BuildContext context, String imageUrl, String name, String role, String dept, IconData iconData, bool isOnline) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          /// AVATAR WITH ONLINE INDICATOR
          Stack(
            children: [
              CircleAvatar(
                radius: 25,
                backgroundImage: NetworkImage(imageUrl),
              ),
              Positioned(
                top: 0,
                left: 0,
                child: Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(
                    color: isOnline ? Colors.green : Colors.grey,
                    shape: BoxShape.circle,
                    border: Border.all(color: theme.colorScheme.surface, width: 2),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 16),

          /// INFO
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: isDark ? Colors.white : AppColors.textDark),
                ),
                const SizedBox(height: 4),
                Text(role, style: const TextStyle(color: AppColors.textLight, fontSize: 13)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(iconData, size: 14, color: theme.primaryColor),
                    const SizedBox(width: 4),
                    Expanded(child: Text(dept, style: TextStyle(color: theme.primaryColor, fontSize: 12, fontWeight: FontWeight.w600))),
                  ],
                ),
              ],
            ),
          ),

          /// CHAT ICON & STATUS
          Column(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: theme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(LucideIcons.messageCircle, color: theme.primaryColor, size: 20),
              ),
              const SizedBox(height: 6),
              Text(
                isOnline ? "Online" : "Offline",
                style: TextStyle(
                  color: isOnline ? Colors.green : Colors.grey,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
