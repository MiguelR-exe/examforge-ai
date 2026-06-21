import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import Quiz from "../pages/Quiz";
import Results from "../pages/Results";
import Profile from "../pages/Profile";

import ProtectedRoute from "../components/layout/ProtectedRoute";

export default function AppRoutes() {
return ( <Routes>

  {/* Públicas */}

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  {/* Privadas */}

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/upload"
    element={
      <ProtectedRoute>
        <Upload />
      </ProtectedRoute>
    }
  />

  <Route
    path="/quiz/:quizId"
    element={
      <ProtectedRoute>
        <Quiz />
      </ProtectedRoute>
    }
  />

  <Route
    path="/results/:quizId"
    element={
      <ProtectedRoute>
        <Results />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />

  {/* Inicio */}

  <Route
    path="/"
    element={
      <Navigate
        to="/dashboard"
        replace
      />
    }
  />

  {/* 404 */}

  <Route
    path="*"
    element={
      <Navigate
        to="/dashboard"
        replace
      />
    }
  />

</Routes>

);
}
