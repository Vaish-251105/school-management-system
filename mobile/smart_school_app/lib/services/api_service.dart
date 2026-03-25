import 'dart:convert';
import 'package:dio/dio.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiService {
  static String? customBaseUrl;
  
  static final Dio _dio = Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  ));

  static String get baseUrl {
    if (customBaseUrl != null && customBaseUrl!.isNotEmpty) return customBaseUrl!;
    return "https://school-erp-api-z0on.onrender.com/api";
  }

  static String? _token;

  static void setToken(String token) {
    _token = token;
    _dio.options.headers["Authorization"] = "Bearer $token";
  }

  static Future<dynamic> get(String endpoint) async {
    try {
      print("📡 DIO GET: $baseUrl/$endpoint");
      final response = await _dio.get("$baseUrl/$endpoint");
      print("📥 DIO RESPONSE [${response.statusCode}]");
      return response.data;
    } on DioException catch (e) {
      print("❌ DIO GET ERROR: ${e.message}");
      return {"error": e.message, "message": _getErrorMessage(e)};
    }
  }

  static Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    try {
      print("📡 DIO POST: $baseUrl/$endpoint");
      print("📤 PAYLOAD: ${jsonEncode(data)}");
      final response = await _dio.post("$baseUrl/$endpoint", data: data);
      print("📥 DIO RESPONSE [${response.statusCode}]: ${response.data}");
      return response.data;
    } on DioException catch (e) {
      print("❌ DIO POST ERROR: ${e.message} | Data: ${e.response?.data}");
      return {
        "error": e.message, 
        "message": _getErrorMessage(e),
        "details": e.response?.data
      };
    }
  }

  static String _getErrorMessage(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout) return "Connection timeout. Server might be sleeping.";
    if (e.type == DioExceptionType.receiveTimeout) return "Server response timeout.";
    if (e.type == DioExceptionType.connectionError) return "Cannot reach server. Check internet.";
    if (e.response != null) {
      final msg = e.response?.data?['message'];
      if (msg != null) return msg.toString();
      return "Server error: ${e.response?.statusCode}";
    }
    return "Network error occurred.";
  }

  static Future<dynamic> put(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put("$baseUrl/$endpoint", data: data);
      return response.data;
    } on DioException catch (e) {
      return {"error": e.message, "message": _getErrorMessage(e)};
    }
  }

  static Future<dynamic> delete(String endpoint) async {
    try {
      final response = await _dio.delete("$baseUrl/$endpoint");
      return response.data;
    } on DioException catch (e) {
      return {"error": e.message, "message": _getErrorMessage(e)};
    }
  }

  // AUTH
  static Future<Map<String, dynamic>> login(String email, String password, {String role = "student"}) async {
    final res = await post("auth/login", {
      "email": email, 
      "password": password, 
      "role": role.toLowerCase()
    });
    
    if (res is Map<String, dynamic> && res['token'] != null) {
      setToken(res['token']);
      return res;
    }
    
    // If res is error map from catch, return it
    if (res is Map<String, dynamic>) return res;
    return {"error": "Invalid response from server"};
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password, String role) async {
    final res = await post("auth/register", {
      "name": name,
      "email": email,
      "password": password,
      "role": role.toLowerCase(),
    });
    if (res is Map<String, dynamic>) return res;
    return {"error": "Invalid response from server"};
  }

  // DASHBOARD
  static Future<Map<String, dynamic>> getDashboardStats() async {
    final res = await get("dashboard/stats");
    return res is Map<String, dynamic> ? res : {"error": "Invalid response"};
  }

  // TEACHERS & STAFF
  static Future<List<dynamic>> getTeachers() async {
    final res = await get("teachers");
    return res is List ? res : [];
  }

  static Future<List<dynamic>> getStaff() async {
    final res = await get("teachers/staff/all");
    return res is List ? res : [];
  }

  static Future<dynamic> updateTeacher(String id, Map<String, dynamic> data) => put("teachers/$id", data);
  static Future<dynamic> deleteTeacher(String id) => delete("teachers/$id");

  // STUDENTS
  static Future<List<dynamic>> getStudents() async {
    final res = await get("students");
    return res is Map ? (res['students'] ?? []) : [];
  }

  static Future<dynamic> updateStudent(String id, Map<String, dynamic> data) => put("students/$id", data);
  static Future<dynamic> deleteStudent(String id) => delete("students/$id");

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

  // STAFF ATTENDANCE
  static Future<List<dynamic>> getStaffAttendanceList({String? date}) async {
    final res = await get("staff-attendance${date != null ? '?date=$date' : ''}");
    return res is List ? res : [];
  }

  static Future<dynamic> markStaffAttendance(List<Map<String, dynamic>> attendanceData, String date) =>
      post("staff-attendance", {"attendanceData": attendanceData, "date": date});

  // MESSAGES
  static Future<dynamic> sendMessage(String recipientId, String subject, String message) =>
      post("messages", {"recipientId": recipientId, "subject": subject, "message": message});

  static Future<List<dynamic>> getRecipients() async {
    final res = await get("teachers/recipients");
    return res is List ? res : [];
  }

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

  // SUBMISSIONS
  static Future<List<dynamic>> getSubmissions(String homeworkId) async {
    final res = await get("submissions?homeworkId=$homeworkId");
    return res is List ? res : [];
  }

  static Future<dynamic> submitHomework(String homeworkId, String content) =>
      post("submissions", {"homeworkId": homeworkId, "content": content});

  static Future<dynamic> gradeSubmission(String id, String grade, String remarks) =>
      put("submissions/$id/grade", {"grade": grade, "remarks": remarks});

  // EXAMS
  static Future<List<dynamic>> getExams() async {
    final res = await get("exams/all");
    return res is List ? res : [];
  }

  static Future<dynamic> createExam(Map<String, dynamic> data) => post("exams", data);

  static Future<List<dynamic>> getExamSchedule({String? className}) async {
    final res = await get("exams/schedule${className != null ? '?className=$className' : ''}");
    return res is List ? res : [];
  }

  static Future<dynamic> createExamSchedule(Map<String, dynamic> data) => post("exams/schedule", data);

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

  // TIMETABLE
  static Future<List<dynamic>> getTimetables() async {
    final res = await get("timetable");
    return res is List ? res : [];
  }

  static Future<List<dynamic>> getTimetableByClass(String classId) async {
    final res = await get("timetable/class/$classId");
    return res is List ? res : [];
  }

  // CLASSES
  static Future<List<dynamic>> getClasses() async {
    final res = await get("classes");
    return res is List ? res : [];
  }

  static Future<dynamic> createClass(Map<String, dynamic> data) => post("classes", data);

  // TRANSPORT
  static Future<List<dynamic>> getBuses() async {
    final res = await get("bus");
    return res is List ? res : [];
  }

  static Future<dynamic> updateBusLocation(String id, double lat, double lng, String status) =>
      put("bus/$id/location", {"lat": lat, "lng": lng, "status": status});

  // SALARIES (FOR ACCOUNTANT)
  static Future<List<dynamic>> getSalaries() async {
    final res = await get("salaries");
    return res is List ? res : [];
  }
}