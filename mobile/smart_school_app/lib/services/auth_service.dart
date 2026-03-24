import 'package:flutter/material.dart';

class AuthService with ChangeNotifier {
  String? _id;
  String? _name;
  String? _email;
  String? _role;
  String? _token;

  Map<String, dynamic>? _details;

  String get id => _id ?? "";
  String get name => _name ?? "User";
  String get email => _email ?? "";
  String get role => _role ?? "";
  String get token => _token ?? "";
  Map<String, dynamic> get details => _details ?? {};

  void setUser(Map<String, dynamic> data) {
    _id = data['id'] ?? data['_id'];
    _name = data['name'];
    _email = data['email'];
    _role = data['role'];
    _token = data['token'];
    _details = data;
    notifyListeners();
  }

  void logout() {
    _id = null;
    _name = null;
    _email = null;
    _role = null;
    _token = null;
    _details = null;
    notifyListeners();
  }
}
