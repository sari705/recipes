const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization'); // בדיקת כותרת ה-Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    

    const token = authHeader.split(' ')[1]; // חילוץ הטוקן
    console.log("auth token: ", token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // אימות הטוקן
        console.log('Decoded Token:', jwt.verify(token, process.env.JWT_SECRET));

        req.user = { userId: decoded.userId }; // שמירת מזהה המשתמש בבקשה
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = auth;
