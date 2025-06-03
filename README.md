# Taste-Sphere 🍽️

**Taste-Sphere** הוא אפליקציית מתכונים אינטראקטיבית המאפשרת למשתמשים לשתף, לאהוב, להגיב ולחפש מתכונים – מבוסס על React בצד הלקוח ו-Node.js + Express בצד השרת.

## 🔧 טכנולוגיות

- **Frontend**: React, Bootstrap, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Deployment**: Netlify (Frontend) + Render (Backend)
- **Auth**: JWT-based authentication

## 📂 מבנה הפרויקט

```
family-recipes/
│
├── backend/              # צד שרת (Node.js + Express)
│   ├── routes/           # כל המסלולים (Recipes, Users וכו')
│   ├── models/           # סכמות של Mongoose
│   └── server.js         # נקודת כניסה
│
├── frontend/             # צד לקוח (React)
│   ├── public/           # קבצים סטטיים
│   ├── src/              # קומפוננטות React
│   └── package.json      # תלויות React
│
└── README.md             # תיעוד (את הקובץ הזה!)
```

## 🚀 הפעלה מקומית

1. **שכפול הריפו**:
   ```bash
   git clone https://github.com/sari705/Taste-Sphere.git
   ```

2. **התקנת תלויות**:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **הרצת השרתים**:

   - ב-backend:
     ```bash
     npm start
     ```

   - ב-frontend:
     ```bash
     npm start
     ```

## 🌍 קישורים

- **Frontend ב-Netlify**: https://your-netlify-url.netlify.app  
- **Backend ב-Render**: https://taste-sphere.onrender.com

## 📝 הערות

- יש לוודא שכתובת ה-API ב-React (`REACT_APP_BACKEND_URL`) מוגדרת כראוי בקובץ `.env`
- ניתן לבצע login/register לצורך ביצוע לייקים או הוספת תגובות

---

*פיתוח: Sari Heisherik | 2024*
