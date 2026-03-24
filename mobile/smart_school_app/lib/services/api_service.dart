import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiService {
  // SET THIS TO YOUR DEPLOYED BACKEND URL (e.g., https://my-school-api.onrender.com/api)
  static String? customBaseUrl;

  static String get baseUrl {
    if (customBaseUrl != null) return customBaseUrl!;
    
    if (kIsWeb) return "http://localhost:5000/api";
    // For Android Emulator, localhost is 10.0.2.2
    if (Platform.isAndroid) return "http://10.0.2.2:5000/api";
    return "http://localhost:5000/api";
  }

  static String? _token;

  static void setToken(String token) {
    _token = token;
  }

  static Map<String, String> get _headers => {
    "Content-Type": "application/json",
    if (_token != null) "Authorization": "Bearer $_token",
  };

  // GENERIC CRUD METHODS
  static Future<dynamic> get(String endpoint) async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/$endpoint"), headers: _headers);
      return jsonDecode(response.body);
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  static Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/$endpoint"),
        headers: _headers,
        body: jsonEncode(data),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  static Future<dynamic> put(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await http.put(
        Uri.parse("$baseUrl/$endpoint"),
        headers: _headers,
        body: jsonEncode(data),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  static Future<dynamic> delete(String endpoint) async {
    try {
      final response = await http.delete(Uri.parse("$baseUrl/$endpoint"), headers: _headers);
      return jsonDecode(response.body);
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  // AUTH
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final data = await post("auth/login", {"email": email, "password": password});
    if (data is Map<String, dynamic> && data['token'] != null) {
      setToken(data['token']);
    }
    return data;
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password, String role) async {
    return await post("auth/register", {
      "name": name,
      "email": email,
      "password": password,
      "role": role.toLowerCase(),
    });
  }

  // DASHBOARD
  static Future<Map<String, dynamic>> getDashboardStats() async {
    final res = await get("dashboard/stats");
    return res is Map<String, dynamic> ? res : {"error": "Invalid response"};
  }

  // TEACHERS
  static Future<List<dynamic>> getTeachers() async {
    final res = await get("teachers");
    return res is List ? res : [];
  }

  // STUDENTS
  static Future<List<dynamic>> getStudents() async {
    final res = await get("students");
    return res is List ? res : [];
  }

  // HOMEWORK
  static Future<List<dynamic>> getHomework() async {
    final res = await get("homework");
    return res is List ? res : [];
  }

  static Future<dynamic> createHomework(Map<String, dynamic> data) => post("homework", data);
  static Future<dynamic> updateHomework(String id, Map<String, dynamic> data) => put("homework/$id", data);
  static Future<dynamic> deleteHomework(String id) => delete("homework/$id");

  // FEES
  static Future<List<dynamic>> getFees() async {
    final res = await get("fees");
    return res is List ? res : [];
  }

  static Future<dynamic> createFee(Map<String, dynamic> data) => post("fees", data);
  static Future<dynamic> updateFee(String id, Map<String, dynamic> data) => put("fees/$id", data);
  static Future<dynamic> deleteFee(String id) => delete("fees/$id");

  // NOTICES
  static Future<List<dynamic>> getNotices() async {
    final res = await get("notices");
    return res is List ? res : [];
  }

  static Future<dynamic> createNotice(Map<String, dynamic> data) => post("notices", data);
  static Future<dynamic> deleteNotice(String id) => delete("notices/$id");

  // ATTENDANCE
  static Future<List<dynamic>> getAttendance() async {
    final res = await get("attendance");
    return res is List ? res : [];
  }

  static Future<dynamic> markAttendance(Map<String, dynamic> data) => post("attendance", data);

  // MESSAGES
  static Future<dynamic> sendMessage(String recipientId, String subject, String message) =>
      post("messages", {"recipientId": recipientId, "subject": subject, "message": message});

  static Future<List<dynamic>> getInbox() async {
    final res = await get("messages/inbox");
    return res is Map ? (res['messages'] ?? []) : [];
  }

  static Future<List<dynamic>> getSentMessages() async {
    final res = await get("messages/sent");
    return res is Map ? (res['messages'] ?? []) : [];
  }

  static Future<dynamic> getMessage(String id) => get("messages/$id");

  static Future<dynamic> markMessageAsRead(String id) => put("messages/$id/read", {});

  static Future<dynamic> deleteMessage(String id) => delete("messages/$id");

  static Future<dynamic> getUnreadCount() => get("messages/unread-count");

  // EXAMS
  static Future<List<dynamic>> getExams() async {
    final res = await get("exams");
    return res is List ? res : [];
  }

  static Future<dynamic> createExam(Map<String, dynamic> data) => post("exams", data);

  static Future<List<dynamic>> getExamResults() async {
    final res = await get("exams/results");
    return res is List ? res : [];
  }

  static Future<dynamic> submitExamResult(Map<String, dynamic> data) => post("exams/results", data);

  // PAY FEE
  static Future<dynamic> payFee(String id, String transactionId) => post("fees/pay/$id", {"transactionId": transactionId});

  // EXPENSES
  static Future<List<dynamic>> getExpenses() async {
    final res = await get("expenses");
    return res is List ? res : [];
  }

  static Future<dynamic> createExpense(Map<String, dynamic> data) => post("expenses", data);
  static Future<dynamic> deleteExpense(String id) => delete("expenses/$id");
}