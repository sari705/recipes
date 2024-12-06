import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("יש להרשם כדי להכנס לדף זה");
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
