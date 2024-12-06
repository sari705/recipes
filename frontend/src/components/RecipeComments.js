import React, { useState, useEffect } from "react";
import axios from "axios";

const RecipeComments = ({ recipeId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showComments, setShowComments] = useState(false); // מצב להצגת התגובות
    const [loading, setLoading] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    // שליפת התגובות מהשרת
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendUrl}/api/recipes/${recipeId}/comments`);
                setComments(response.data);
            } catch (err) {
                console.error("Error fetching comments:", err.response || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [recipeId]);

    // הוספת תגובה חדשה
    const handleAddComment = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to add a comment.");
                return;
            }

            const response = await axios.post(
                `${backendUrl}/api/recipes/${recipeId}/comments`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const addedComment = response.data;

            // עדכון התגובה החדשה בסטייט
            setComments((prevComments) => [...prevComments, addedComment]);
            setNewComment(""); // איפוס התיבה
        } catch (err) {
            console.error("Error adding comment:", err.response || err.message);
            alert("נכשל בהוספת תגובה");
        }
    };

    return (
        <div className="mt-3">
            {/* כפתור הצגת/הסתרת תגובות */}
            <button
                className="btn btn-secondary mb-2"
                onClick={() => setShowComments(!showComments)} // הפיכת המצב
            >
                {showComments ? "הסתר תגובות" : "הצג תגובות"}
            </button>

            {/* תצוגת תגובות */}
            {showComments && (
                <div className="comments-section p-3 border rounded bg-light">
                    {loading ? (
                        <p>טוען תגובות...</p>
                    ) : comments.length === 0 ? (
                        <p>אין עדיין תגובות☹️, תהיה הראשון שמגיב!!</p>
                    ) : (
                        <ul className="list-group">
                            {comments.map((comment) => (
                                <li key={comment._id} className="list-group-item">
                                    <strong>{comment.user?.name || "Anonymous"}:</strong> {comment.content}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* טופס להוספת תגובה */}
                    <div className="mt-3">
                        <textarea
                            className="form-control"
                            placeholder="הוסף את התגובה שלך..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <button
                            className="btn btn-primary mt-2"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()} // השבתת כפתור אם התגובה ריקה
                        >
                            הוסף תגובה
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeComments;
