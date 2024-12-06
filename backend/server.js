const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// טוען משתני סביבה
dotenv.config();

// יצירת אפליקציית Express
const app = express();

// שימוש ב-CORS
app.use(cors());

// Middleware לעבודה עם JSON
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Static middleware להצגת תמונות שהועלו
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// חיבור ל-MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // מסיים את התהליך במקרה של כשל
  });

// שימוש בנתיבים
const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

const userRoutes = require('./routes/users'); // ודא ששמות התיקיות נכונים
app.use('/api/users', userRoutes);

// טיפול בנתיבים שאינם קיימים
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// טיפול בשגיאות כלליות
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
