import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeComments from './RecipeComments.js';
import categories from './categiries.js';
import { useNavigate } from 'react-router-dom';
import { filterRecipes } from './utils.js';



const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate(); // נביגציה לדף אחר
    const backendUrl = process.env.REACT_APP_BACKEND_URL;



    // סינון מתכונים
    const filteredRecipes = filterRecipes(recipes, searchTerm, selectedCategory);


    // שליפת מתכונים מהשרת
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/recipes`);
                setRecipes(response.data);
            } catch (err) {
                console.error('Error fetching recipes:', err);
            }
        };

        fetchRecipes();
    }, []);

    const handleLike = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to like recipes.');
                return;
            }

            const response = await axios.put(
                `${backendUrl}/api/recipes/${id}/like`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setRecipes((prevRecipes) =>
                prevRecipes.map((recipe) =>
                    recipe._id === id ? { ...recipe, likes: response.data.likes } : recipe
                )
            );
        } catch (err) {
            console.error('Error liking recipe:', err);
            alert('Failed to like recipe.');
        }
    };

    const handleShare = (recipeId) => {
        const url = `${window.location.origin}/recipes/${recipeId}`;
        navigator.clipboard.writeText(url)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Failed to copy the link.'));
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">מתכונים</h2>

            <input
                type="text"
                placeholder="Search recipes..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-3"
            />

            <select
                className="form-select mb-4"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">כל הקטגוריות</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>

            {recipes.length === 0 ? (
                <p className="text-center">לא נמצאו מתכונים😭</p>
            ) : (
                <div className="row">
                    {filteredRecipes.map((recipe) => (
                        <div className="col-md-6 mb-4" key={recipe._id}>
                            <div className="card shadow-sm"

                            >
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    className="card-img-top"
                                    style={{
                                        height: '500px',
                                        objectFit: 'cover',
                                        borderBottom: '3px solid #f1f1f1',
                                        cursor: 'pointer',
                                        objectPosition: 'center',
                                    }}
                                    onClick={() => navigate(`/recipes/${recipe._id}`)} // ניווט בלחיצה על הכרטיס
                                />
                                {console.log('Image URL:', `${backendUrl}${recipe.image_url}`)}
                                <div className="card-body">
                                    <h5 className="card-title text-truncate" title={recipe.title}>
                                        {recipe.title}
                                    </h5>
                                    <button
                                        className="btn btn-link p-0 mb-2"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${recipe._id}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse-${recipe._id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        הצג פרטים
                                    </button>
                                    <div id={`collapse-${recipe._id}`} className="collapse">
                                        <div className="card-text">
                                            <p>
                                                <strong>רכיבים:</strong>
                                            </p>
                                            <ul>
                                                {recipe.ingredients
                                                    .flatMap((item) =>
                                                        item.includes('\n') ? item.split('\n') : [item]
                                                    ) // מפצל לפי '\n' אם יש
                                                    .map((ingredient, index) => (
                                                        <li key={index}>{ingredient.trim()}</li>
                                                    ))}
                                            </ul>
                                        </div>
                                        <div className="card-text">
                                            <p>
                                                <strong>שלבי הכנה:</strong>
                                            </p>
                                            <ol>
                                                {recipe.steps
                                                    .flatMap((item) =>
                                                        item.includes('\n') ? item.split('\n') : [item]
                                                    ) // מפצל לפי '\n' אם יש
                                                    .map((step, index) => (
                                                        <li key={index}>{step.trim()}</li>
                                                    ))}
                                            </ol>
                                        </div>

                                    </div>
                                    <p className="text-muted small">
                                        <strong>תגובות:</strong> {recipe.comments.length}
                                    </p>
                                </div>
                                <div className="card-footer d-flex justify-content-between align-items-center">
                                    <button
                                        className="btn btn-outline-success btn-sm"
                                        onClick={() => handleLike(recipe._id)}
                                    >
                                        ❤️ Like ({recipe.likes.length})
                                    </button>
                                    <button
                                        className="btn btn-outline-info btn-sm"
                                        onClick={() => handleShare(recipe._id)}
                                    >
                                        📤 Share
                                    </button>
                                </div>
                                <div className="card-footer mt-2 p-3 bg-light border-top">
                                    <RecipeComments recipeId={recipe._id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeList;
