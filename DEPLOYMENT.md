# 🚀 School ERP Deployment Guide

Follow these steps to deploy your Smart School Management System (Web + Mobile) to production.

## 🛠 Prerequisites
1.  **MongoDB Atlas**: Create a free cluster and get your `MONGO_URI`.
2.  **Platform Accounts**: Create accounts on [Vercel](https://vercel.com) (Frontend) and [Render](https://render.com) (Backend).

---

## 1. Backend Deployment (Render.com)
The backend is a Node/Express server.

1.  **Connect Repo**: Connect your GitHub repository to Render.
2.  **Web Service**: Create a new "Web Service".
3.  **Root Directory**: Set to `BACKEND`.
4.  **Build Command**: `npm install`
5.  **Start Command**: `node server.js`
6.  **Environment Variables**:
    *   **`MONGO_URI`**: Your MongoDB Atlas connection string.
    *   **`JWT_SECRET`**: A secure random string.
    *   **`PORT`**: `5000` (Render will override this, but standard for local).

**Once deployed, copy your Backend URL (e.g., `https://school-api.onrender.com`).**

**Current Backend URL: [https://school-erp-api-z0on.onrender.com](https://school-erp-api-z0on.onrender.com)**

---

## 2. Frontend Deployment (Vercel)
The frontend is a Vite + React application.

1.  **Connect Repo**: Connect your repository to Vercel.
2.  **New Project**: Create a new project.
3.  **Root Directory**: Set to `frontend`.
4.  **Framework Preset**: Vite.
5.  **Build Command**: `npm run build`
6.  **Output Directory**: `dist`
7.  **Environment Variables**:
    *   **`VITE_API_URL`**: `https://your-backend-url.onrender.com/api` (The URL you copied from Step 1).

---

## 3. Mobile App Connectivity (Flutter)
To connect your mobile app to the deployed production system:

1.  Open `mobile/smart_school_app/lib/services/api_service.dart`.
2.  Update `customBaseUrl` on Line 8:
    ```dart
    static String? customBaseUrl = "https://school-erp-api-z0on.onrender.com/api";
    ```
3.  Rebuild your APK: `flutter build apk`.

---

## 📊 Post-Deployment Checklist
- [ ] Login with `admin@school.com` and password `123`.
- [ ] Verify Dashboard shows live stats.
- [ ] Record an expense and check if it reflects on both Web and Mobile.
- [ ] Mark attendance and verify it saves successfully.

---

> [!TIP]
> **Pro Tip**: Use the Master Password `123` to log in with any email address for testing all roles (Admin, Teacher, Parent) without manually creating passwords each time.
