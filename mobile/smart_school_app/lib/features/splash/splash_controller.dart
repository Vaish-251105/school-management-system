import 'dart:async';
import 'package:flutter/material.dart';
import '../auth/login_screen.dart';

class SplashController {
  static void start(BuildContext context) {
    Timer(const Duration(seconds: 3), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => LoginScreen()),
      );
    });
  }
}