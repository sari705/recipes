import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// utils.js


// סינון מתכונים
export const filterRecipes = (recipes, searchTerm, selectedCategory) => {
    return recipes.filter((recipe) => {
        const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
        const matchesSearchTerm = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearchTerm;
    });
};

// העלאת תמונה לשרת
export const uploadImage = async (imageFile, token) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(
        `${backendUrl}/api/recipes/upload`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.filePath; // מחזיר את הקישור לתמונה
};
