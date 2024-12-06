import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import RecipeComments from './RecipeComments.js';
import { useNavigate } from 'react-router-dom';
import categories from './categiries.js';
import { filterRecipes, uploadImage } from './utils.js'; // ייבוא פונקציות


const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();
    const editFormRef = useRef(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;




    // טעינת המתכונים של המשתמש
    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                const token = localStorage.getItem('token'); // שליפת הטוקן מה-localStorage
                const response = await axios.get(`${backendUrl}/api/recipes/my-recipes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipes(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load your recipes.');
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, []);

    const filteredRecipes = filterRecipes(recipes, searchTerm, selectedCategory);


    // מחיקת מתכון
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token'); // ודאי שהטוקן קיים

            await axios.delete(`${backendUrl}/api/recipes/${recipeToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // הוספת הטוקן לכותרת
                },
            });

            setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeToDelete)); // עדכון הסטייט
            alert('Recipe deleted successfully!');
            setRecipeToDelete(null); // איפוס המודל
        } catch (err) {
            console.error('Error deleting recipe:', err.response || err.message);
            alert('Failed to delete recipe.');
        }
    };

    // פתיחת טופס עריכה
    const handleEdit = (recipe) => {
        setEditingRecipe(recipe); // שמירת המתכון לעריכה
        setFormVisible(true); // הצגת טופס העריכה
        setTimeout(() => {
            editFormRef.current?.scrollIntoView({ behavior: 'smooth' }); // גלילה חלקה לטופס העריכה
        }, 100);
    };

    // עדכון מתכון
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // העלאת תמונה חדשה אם קיימת
            let imageUrl = editingRecipe.image_url;
            if (newImage) {
                imageUrl = await uploadImage(newImage, token);
            }

            // עדכון המתכון
            const response = await axios.put(
                `${backendUrl}/api/recipes/${editingRecipe._id}`,
                { ...editingRecipe, image_url: imageUrl },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // עדכון רשימת המתכונים אחרי העריכה
            setRecipes((prev) =>
                prev.map((recipe) =>
                    recipe._id === editingRecipe._id ? response.data : recipe
                )
            );

            setFormVisible(false);
            setEditingRecipe(null);
            alert('Recipe updated successfully!');
        } catch (err) {
            console.error('Error updating recipe:', err.response || err.message);
            alert('Failed to update recipe.');
        }
    };

    // תצוגה בזמן טעינה או שגיאה
    if (loading) return <p>טוען...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">המתכונים שלי</h2>
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
                <p className="text-center">לא נמצאו מתכונים.</p>
            ) : (

                <div className="row">
                    {filteredRecipes.map((recipe) => (
                        <div className="col-md-6 mb-4" key={recipe._id}>
                            <div className="card shadow-sm">
                                {/* תמונת מתכון */}
                                <img
                                    src={recipe.image_url}
                                    
                                    className="card-img-top"
                                    alt={recipe.title}
                                    style={{
                                        maxHeight: '500px',
                                        objectFit: 'cover',
                                        cursor: 'pointer', 
                                        objectPosition: 'center',
                                    }}
                                    onClick={() => navigate(`/recipes/${recipe._id}`)}
                                />
                                {console.log('Image URL:', recipe.image_url)}

                                {/* גוף הכרטיס */}
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
                                <div className="card-footer mt-2 p-3 bg-light border-top">
                                    <RecipeComments recipeId={recipe._id} />
                                </div>

                                {/* כפתורים */}
                                <div className="card-footer d-flex justify-content-between">
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleEdit(recipe)}
                                    >
                                        ✏️ ערוך
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => setRecipeToDelete(recipe._id)} // פתיחת המודל
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteModal"
                                    >
                                        🗑️ מחק
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* טופס עריכה */}
            {formVisible && editingRecipe && (
                <form
                    onSubmit={handleUpdate}
                    className="mt-4 p-4 border rounded shadow-sm bg-light"
                    ref={editFormRef}
                >
                    <h3 className="text-center">Edit Recipe</h3>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={editingRecipe.title}
                            onChange={(e) =>
                                setEditingRecipe({ ...editingRecipe, title: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ingredients (comma-separated)</label>
                        <textarea
                            className="form-control"
                            name="ingredients"
                            value={editingRecipe.ingredients.join(',')}
                            onChange={(e) =>
                                setEditingRecipe({
                                    ...editingRecipe,
                                    ingredients: e.target.value.split(','),
                                })
                            }
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Steps (dot-separated)</label>
                        <textarea
                            className="form-control"
                            name="steps"
                            value={editingRecipe.steps.join('.')}
                            onChange={(e) =>
                                setEditingRecipe({
                                    ...editingRecipe,
                                    steps: e.target.value.split('.'),
                                })
                            }
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Change Image</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setNewImage(e.target.files[0])}
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary me-2">
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setFormVisible(false);
                                setEditingRecipe(null);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* מודל למחיקה */}
            <div
                className="modal fade"
                id="deleteModal"
                tabIndex="-1"
                aria-labelledby="deleteModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">
                                Confirm Deletion
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this recipe? This action cannot be undone.
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={handleDelete}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRecipes;
