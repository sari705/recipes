import React, { useState } from 'react';
import axios from 'axios';
import categories from './categiries.js';

const RecipeForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        steps: '',
        image: null,
        category: '',
        is_public: true,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert('הקובץ גדול מדי. יש להעלות תמונה עד 5MB.');
            return;
        }
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.title ||
            !formData.ingredients ||
            !formData.steps ||
            !formData.category
        ) {
            alert('אנא מלא את כל השדות.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let imageUrl = '';
            if (formData.image) {
                const formDataImage = new FormData();
                formDataImage.append('image', formData.image);

                const uploadResponse = await axios.post(
                    `${backendUrl}/api/recipes/upload`,
                    formDataImage,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                imageUrl = `${backendUrl}${uploadResponse.data.filePath}`;
                console.log("image url: " + imageUrl);
            }

            if (!imageUrl) {
                alert('לא ניתן להוסיף מתכון ללא תמונה.');
                return;
            }


            const recipeData = {
                title: formData.title,
                ingredients: formData.ingredients
                    .split('\n')
                    .map((item) => item.trim())
                    .filter((item) => item !== ''),
                steps: formData.steps
                    .split('\n')
                    .map((item) => item.trim())
                    .filter((item) => item !== ''),
                category: formData.category,
                image_url: imageUrl,
                is_public: formData.is_public,
            };

            await axios.post(`${backendUrl}/api/recipes`, recipeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('מתכון נוסף בהצלחה!');
            setFormData({
                title: '',
                ingredients: '',
                steps: '',
                image: null,
                category: '',
                is_public: true,
            });
            setPreviewImage(null);
        } catch (err) {
            console.error('Error adding recipe:', err.response || err.message);
            alert('שגיאה בהוספת המתכון.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="p-4 border rounded shadow-sm bg-white" onSubmit={handleSubmit}>
            <h2 className="text-center">Add a New Recipe</h2>
            <label className="form-check mb-3">
                <input
                    type="checkbox"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleChange}
                    className="form-check-input"
                />
                ציבורי
            </label>
            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control mb-3"
                required
            >
                <option value="">בחר קטגוריה</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
            <input
                type="text"
                className="form-control mb-3"
                name="title"
                placeholder="כותרת"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <textarea
                className="form-control mb-3"
                name="ingredients"
                placeholder="רכיבים (יש להפריד בירידת שורה)"
                value={formData.ingredients}
                onChange={handleChange}
                required
            ></textarea>
            <textarea
                className="form-control mb-3"
                name="steps"
                placeholder="שלבי הכנה (יש להפריד בירידת שורה)"
                value={formData.steps}
                onChange={handleChange}
                required
            ></textarea>
            <input
                type="file"
                className="form-control mb-3"
                name="image"
                onChange={handleFileChange}
            />
            {previewImage && (
                <img
                    src={previewImage}
                    alt="Preview"
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
            )}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'שולח...' : 'הוסף מתכון'}
            </button>
            <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={() => {
                    setFormData({
                        title: '',
                        ingredients: '',
                        steps: '',
                        image: null,
                        category: '',
                        is_public: true,
                    });
                    setPreviewImage(null);
                }}
            >
                נקה טופס
            </button>
        </form>
    );
};

export default RecipeForm;
