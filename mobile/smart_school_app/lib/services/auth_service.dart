import 'package:flutter/material.dart';

class AuthService with ChangeNotifier {
  String? _name;
  String? _email;
  String? _role;
  String? _token;

  String get name => _name ?? "User";
  String get email => _email ?? "";
  String get role => _role ?? "";
  String get token => _token ?? "";

  void setUser(Map<String, dynamic> data) {
    _name = data['name'];
    _email = data['email'];
    _role = data['role'];
    _token = data['token'];
    notifyListeners();
  }

  void logout() {
    _name = null;
    _email = null;
    _role = null;
    _token = null;
    notifyListeners();
  }
}
