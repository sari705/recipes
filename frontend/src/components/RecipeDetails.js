import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeComments from './RecipeComments';

const RecipeDetails = () => {
    const { id } = useParams(); // מזהה המתכון מה-URL
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/recipes/${id}`);
                setRecipe(response.data);
            } catch (err) {
                console.error('Error fetching recipe:', err.response || err.message);
                setError('Failed to load recipe.');
            }
        };

        fetchRecipe();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${backendUrl}/api/recipes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Recipe deleted successfully!');
                navigate('/my-recipes');
            } catch (err) {
                console.error('Error deleting recipe:', err.response || err.message);
                alert('Failed to delete recipe.');
            }
        }
    };

    if (error) return <p className="text-danger">{error}</p>;
    if (!recipe) return <p>טוען...</p>;

    return (
        <div className="container mt-5">
            {/* כותרת */}
            <h1 className="text-center mb-4">{recipe.title}</h1>
            <button
                className="btn btn-secondary mb-3"
                onClick={() => navigate(-1)}
            >
                ← חזרה
            </button>
            {/* תוכן המתכון */}
            <div className="row">
                {/* תמונה */}
                <div className="col-lg-6 mb-4 text-center">
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="img-fluid rounded shadow-sm fade-in"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>

                {/* פרטים */}
                <div className="col-lg-6 recipe-details fade-in">
                    <h4 className="mb-3">רכיבים:</h4>
                    <ul className="ms-4">
                        {recipe.ingredients
                            .flatMap((item) =>
                                item.includes('\n') ? item.split('\n') : [item]
                            ) // מפצל לפי '\n' אם יש
                            .map((ingredient, index) => (
                                <li key={index}>{ingredient.trim()}</li>
                            ))}
                    </ul>

                    <h4 className="mt-4 mb-3">שלבי הכנה:</h4>
                    <ol className="ms-4">
                        {recipe.steps
                            .flatMap((item) =>
                                item.includes('\n') ? item.split('\n') : [item]
                            ) // מפצל לפי '\n' אם יש
                            .map((step, index) => (
                                <li key={index}>{step.trim()}</li>
                            ))}
                    </ol>

                    <h5 className="mt-4">
                        קטגוריה: <span className="badge bg-primary">{recipe.category}</span>
                    </h5>

                    {/* כפתורים */}
                    <div className="d-flex gap-2 mt-4">
                        <button className="btn btn-success" onClick={() => alert('Liked!')}>
                            ❤️ Like ({recipe.likes.length})
                        </button>
                        <button
                            className="btn btn-info"
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                        >
                            📤 Share
                        </button>
                        {recipe.user === localStorage.getItem('userId') && (
                            <button className="btn btn-danger" onClick={handleDelete}>
                                🗑️ מחק
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* תגובות */}
            <hr className="my-4" />
            <RecipeComments recipeId={id} />
        </div>
    );
};

export default RecipeDetails;
