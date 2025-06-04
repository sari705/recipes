# Taste-Sphere 🍽️

**Taste-Sphere** היא אפליקציית מתכונים מבוססת MERN המאפשרת למשתמשים לשתף, לחפש ולאהוב מתכונים.
הפרויקט מחולק ל־backend ב־Node.js ול־frontend ב־React.

## ✨ תכונות עיקריות
- ניהול משתמשים עם JWT (הרשמה והתחברות)
- יצירה, עריכה ומחיקה של מתכונים
- העלאת תמונות למתכונים באמצעות Multer
- לייקים והוספת תגובות
- סינון מתכונים לפי קטגוריה וחיפוש
- הגנה על מסלולים פרטיים בצד הלקוח

## 🔧 טכנולוגיות
- **Frontend**: React, Bootstrap, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JSON Web Tokens
- **Deployment Example**: Netlify (Frontend) + Render (Backend)

## 📂 מבנה הפרויקט
```
project-root/
├── backend/        # קוד צד שרת (Express)
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
├── frontend/       # קוד צד לקוח (React)
│   ├── public/
│   └── src/
└── README.md
```

## 🚀 התקנה והפעלה
1. שכפול הריפו
   ```bash
   git clone <repository-url>
   cd recipes
   ```
2. התקנת תלויות
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. יצירת קבצי `.env`
   - `backend/.env`
     ```
     MONGO_URI=<connection-string>
     JWT_SECRET=<your-secret>
     ```
   - `frontend/.env`
     ```
     REACT_APP_BACKEND_URL=http://localhost:5000
     ```
4. הרצת השרתים
   ```bash
   cd backend && npm run dev
   ```
   ובטרמינל נוסף:
   ```bash
   cd frontend && npm start
   ```

## 🌍 קישורים חיים
- Frontend: https://your-netlify-url.netlify.app
- Backend: https://taste-sphere.onrender.com

## 📝 הערות
- ודאו שמסד הנתונים פעיל וכתובות ה־API מעודכנות בקובצי הסביבה
- לאחר login מתקבל טוקן לשימוש בפעולות הדורשות הרשאה

---
פיתוח: Sari Heisherik | 2024
