import React from "react";
import { Link } from "react-router-dom";
import "../Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';


const Home = () => {
    return (
        <div className="home-container">
            {/* באנר עליון */}
            <div className="banner">
                <div className="banner-content">
                    <h1>Welcome to Taste Sphere</h1>
                    <p>Your favorite place to find and share delicious recipes!</p>
                    <div className="buttons">
                        <Link to="/signup" className="btn btn-primary me-3">
                            התחל
                        </Link>
                        <Link to="/recipes" className="btn btn-outline-light">
                            חקור מתכונים
                        </Link>
                    </div>
                </div>
            </div>

            <div id="homeCarousel" className="carousel slide home-carousel" data-bs-ride="carousel">
                <div className="carousel-inner home-carousel-inner">
                    <div className="carousel-item active home-carousel-item">
                        <img src="/images/1.jpg" className="d-block w-100 home-carousel-img" alt="Welcome Banner" />
                        <div className="carousel-caption d-none d-md-block home-carousel-caption">
                            <h5>Welcome to Family Recipes</h5>
                            <p>Discover recipes from around the world.</p>
                        </div>
                    </div>
                    <div className="carousel-item home-carousel-item">
                        <img src="/images/2.jpg" className="d-block w-100 home-carousel-img" alt="Share Recipes" />
                        <div className="carousel-caption d-none d-md-block home-carousel-caption">
                            <h5>Share Your Favorite Recipes</h5>
                            <p>Upload and share your own creations with the community!</p>
                        </div>
                    </div>
                    <div className="carousel-item home-carousel-item">
                        <img src="/images/3.jpg" className="d-block w-100 home-carousel-img" alt="Delicious Recipes" />
                        <div className="carousel-caption d-none d-md-block home-carousel-caption">
                            <h5>Find Something Delicious</h5>
                            <p>Browse through a variety of categories and cuisines.</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev home-carousel-control" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon home-carousel-control-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next home-carousel-control" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon home-carousel-control-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* תוכן נוסף */}
            <div className="content">
                <h2 className="text-center mt-5">Why Choose Family Recipes?</h2>
                <div className="features d-flex justify-content-around mt-4">
                    <div className="feature">
                        <h3>🍴 Share Your Recipes</h3>
                        <p>Upload your favorite recipes and inspire others.</p>
                    </div>
                    <div className="feature">
                        <h3>💬 Connect with Others</h3>
                        <p>Comment, like, and share recipes with the community.</p>
                    </div>
                    <div className="feature">
                        <h3>🌍 Discover New Ideas</h3>
                        <p>Find recipes from around the world, all in one place.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
