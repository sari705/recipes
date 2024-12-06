import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import MyRecipes from './components/MyRecipes';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Home from "./components/Home";
import RecipeDetails from './components/RecipeDetails';

import ProtectedRoute from './components/ProtectedRoute';
import './custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';




console.log({ RecipeForm, RecipeList, MyRecipes });


const App = () => {
    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/">Taste Sphere</Link>
                    <div>
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/home">דף הבית</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/add-recipe">הוסף מתכון</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/recipes">כל המתכונים</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-recipes">המתכונים שלי</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">התחבר</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">הרשם</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">פרופיל</Link>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
                    <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/add-recipe" element={<RecipeForm />} />
                    <Route path="/recipes" element={<RecipeList />} />
                    <Route path="/my-recipes" element={<MyRecipes />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/recipes/:id" element={<RecipeDetails />} />


                </Routes>
            </div>
        </Router>
    );
};

export default App;
