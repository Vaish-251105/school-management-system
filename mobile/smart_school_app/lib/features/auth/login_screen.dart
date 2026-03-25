import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/constants/colors.dart';
import '../admin/admin_dashboard.dart';
import '../student/main_dashboard.dart';
import '../teacher/teacher_dashboard.dart';
import '../parent/parent_dashboard.dart';
import '../finance/accountant_dashboard.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import 'package:provider/provider.dart';
import 'signup_screen.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  int selectedRole = 0;
  final roles = ["Student", "Teacher", "Parent", "Admin", "Accountant"];
  bool isLoading = false;

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  Future<void> login() async {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill all fields"), backgroundColor: AppColors.error),
      );
      return;
    }

    setState(() => isLoading = true);

    try {
      final role = roles[selectedRole];
      final result = await ApiService.login(email, password, role: role);
      
      if (result.containsKey('token')) {
        if (!mounted) return;
        context.read<AuthService>().setUser(result);
        
        final role = result['role']?.toString().toLowerCase() ?? '';
        
        if (!mounted) return;

        Widget nextScreen;
        if (role == 'admin') {
          nextScreen = const AdminDashboard();
        } else if (role == 'teacher') {
          nextScreen = const TeacherDashboard();
        } else if (role == 'parent') {
          nextScreen = const ParentDashboard();
        } else if (role == 'accountant') {
          nextScreen = const AccountantDashboard();
        } else {
          nextScreen = const MainDashboard();
        }

        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => nextScreen));
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['message'] ?? "Invalid credentials"), backgroundColor: AppColors.error),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Login error: $e"), backgroundColor: AppColors.error),
      );
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
              const SizedBox(height: 20),
              // LOGO
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: const Icon(LucideIcons.graduationCap, color: Colors.white, size: 40),
              ),
              const SizedBox(height: 24),
              Text(
                "Smart School ERP",
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : AppColors.textDark,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "Management System for Modern Education",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: isDark ? Colors.white70 : AppColors.textLight,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 32),

              // ROLE SELECTION GRID
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isDark ? Colors.white10 : AppColors.inputBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: theme.dividerColor.withOpacity(0.1)),
                ),
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: List.generate(roles.length, (index) {
                    bool isSelected = selectedRole == index;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          selectedRole = index;
                          emailController.text = "${roles[index].toLowerCase()}@school.com";
                          passwordController.text = "123";
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        width: (MediaQuery.of(context).size.width - 80) / 3,
                        decoration: BoxDecoration(
                          color: isSelected ? theme.primaryColor : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: theme.primaryColor.withOpacity(0.3),
                                    blurRadius: 8,
                                    offset: const Offset(0, 4),
                                  )
                                ]
                              : [],
                        ),
                        child: Text(
                          roles[index],
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: isSelected ? Colors.white : (isDark ? Colors.white70 : AppColors.textLight),
                            fontSize: 13,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
              const SizedBox(height: 32),

              // EMAIL FIELD
              _buildLabel("Email Address"),
              const SizedBox(height: 8),
              _buildTextField(
                controller: emailController,
                hintText: "Enter your email",
                icon: LucideIcons.mail,
              ),
              const SizedBox(height: 20),

              // PASSWORD FIELD
              _buildLabel("Password"),
              const SizedBox(height: 8),
              _buildTextField(
                controller: passwordController,
                hintText: "••••••••",
                icon: LucideIcons.lock,
                isPassword: true,
              ),
              const SizedBox(height: 12),

              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {},
                  child: const Text(
                    "Forgot Password?",
                    style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // SIGN IN BUTTON
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: isLoading ? null : login,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 4,
                    shadowColor: AppColors.primary.withOpacity(0.4),
                  ),
                  child: isLoading
                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text(
                          "Sign In",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
              const SizedBox(height: 24),

              Row(
                children: [
                  Expanded(child: Divider(color: AppColors.border.withOpacity(0.5))),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Text("OR", style: TextStyle(color: AppColors.textLight, fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                  Expanded(child: Divider(color: AppColors.border.withOpacity(0.5))),
                ],
              ),
              const SizedBox(height: 24),

              // REGISTER BUTTON
              SizedBox(
                width: double.infinity,
                height: 56,
                child: OutlinedButton(
                  onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SignupScreen())),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: isDark ? Colors.white24 : AppColors.primary, width: 2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Text(
                    "Register New Account",
                    style: TextStyle(color: isDark ? Colors.white : AppColors.primary, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 32),

              const Text(
                "Or continue with",
                style: TextStyle(color: AppColors.textLight, fontSize: 13, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 24),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _socialIcon(LucideIcons.globe, "Google"),
                  const SizedBox(width: 24),
                  _socialIcon(LucideIcons.facebook, "Facebook"),
                  const SizedBox(width: 24),
                  _socialIcon(LucideIcons.apple, "Apple ID"),
                ],
              ),
              const SizedBox(height: 48),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Need help? ", style: TextStyle(color: AppColors.textLight)),
                  GestureDetector(
                    onTap: () {},
                    child: const Text(
                      "Contact Support",
                      style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, decoration: TextDecoration.underline),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        text,
        style: TextStyle(
          color: isDark ? Colors.white70 : AppColors.textDark,
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    );
  }

  Widget _buildTextField({required TextEditingController controller, required String hintText, required IconData icon, bool isPassword = false}) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    return Container(
      decoration: BoxDecoration(
        color: isDark ? Colors.white10 : AppColors.inputBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor.withOpacity(0.1)),
      ),
      child: TextField(
        controller: controller,
        obscureText: isPassword,
        style: TextStyle(color: isDark ? Colors.white : AppColors.textDark, fontSize: 15),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: isDark ? Colors.white30 : AppColors.textLight.withOpacity(0.5), fontSize: 14),
          prefixIcon: Icon(icon, color: isDark ? theme.primaryColor : AppColors.primary, size: 20),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        ),
      ),
    );
  }

  void _loginWithSocial(String provider) async {
    final email = "social_${provider.toLowerCase()}@gmail.com";
    emailController.text = email;
    passwordController.text = "123";
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Authenticating with $provider..."),
        duration: const Duration(seconds: 1),
        backgroundColor: AppColors.primary,
      ),
    );
    
    // Auto trigger the login method
    Future.delayed(const Duration(milliseconds: 500), () {
      login();
    });
  }

  Widget _socialIcon(IconData icon, String provider) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GestureDetector(
      onTap: () => _loginWithSocial(provider),
      child: Container(
        height: 60,
        width: 60,
        decoration: BoxDecoration(
          color: isDark ? Colors.white10 : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isDark ? Colors.white10 : AppColors.border.withOpacity(0.5)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Icon(icon, color: isDark ? Colors.white : AppColors.textDark, size: 28),
      ),
    );
  }
}