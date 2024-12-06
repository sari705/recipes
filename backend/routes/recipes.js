const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth'); // Middleware לאימות
const { validateRecipe } = require('../validators/recipeValidator'); // ולידציה
const router = express.Router();

const sanitizeFilename = (filename) => {
  return filename
      .replace(/\s+/g, '-') // החלפת רווחים
      .replace(/[^a-zA-Z0-9.\-_]/g, ''); // הסרת תווים לא חוקיים
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + sanitizeFilename(file.originalname);
      cb(null, uniqueSuffix);
  },
});


// Multer Middleware
const upload = multer({ storage });

/** שינוי: הוספת טיפול בשגיאות כלליות (Middleware) */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** 1. העלאת תמונה */
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ filePath });
});

/** 2. יצירת מתכון חדש */
router.post(
  '/',
  authMiddleware,
  validateRecipe, // שינוי: הוספת ולידציה
  asyncHandler(async (req, res) => {
    const { title, steps, ingredients, image_url, is_public, category } = req.body;

    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      category,
      image_url,
      is_public,
      user: req.user.userId, // מזהה המשתמש מתוך ה-Middleware
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  })
);

/** 3. שליפת כל המתכונים הציבוריים */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const recipes = await Recipe.find({ is_public: true });
    res.status(200).json(recipes);
  })
);

/** 5. שליפת מתכונים פרטיים של משתמש */
router.get('/my-recipes', authMiddleware, async (req, res) => {
  try {
    console.log('User ID from token:', req.user.userId); // לוג ל-User ID
    const recipes = await Recipe.find({ user: req.user.userId });
    res.status(200).json(recipes);
  } catch (err) {
    console.error('Error fetching user recipes:', err); // לוג שגיאה
    res.status(500).json({ error: 'Failed to fetch user recipes.' });
  }
});

/** 4. שליפת מתכון לפי ID */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'name');
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  })
);



/** 6. עדכון מתכון */
router.put(
  '/:id',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { title, ingredients, steps, is_public, image_url } = req.body;
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, ingredients, steps, is_public, image_url },
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found or unauthorized' });
    }
    res.status(200).json(updatedRecipe);
  })
);

/** 7. מחיקת מתכון */
router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    if (recipe.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this recipe.' });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recipe deleted successfully.' });
  })
);

/** 8. הוספת תגובה */
router.post(
  '/:id/comments',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    const newComment = { content, user: req.user.userId };
    recipe.comments.push(newComment);
    await recipe.save();
    const populatedComment = await Recipe.findById(recipe._id)
      .select('comments')
      .populate('comments.user', 'name')
      .then((r) => r.comments.pop());
    res.status(201).json(populatedComment);
  })
);

/** 9. לייקים */
router.put(
  '/:id/like',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    const userId = req.user.userId;
    if (!recipe.likes.includes(userId)) {
      recipe.likes.push(userId);
    } else {
      recipe.likes = recipe.likes.filter((id) => id.toString() !== userId);
    }
    await recipe.save();
    res.status(200).json({ likes: recipe.likes });
  })
);

/** 10. שליפת תגובות */
router.get(
  '/:id/comments',
  asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate('comments.user', 'name');
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.status(200).json(recipe.comments);
  })
);

module.exports = router;
