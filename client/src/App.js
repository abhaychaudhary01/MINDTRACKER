import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import ExerciseTracker from './pages/ExerciseTracker';
import Resources from './pages/Resources';
import Professionals from './pages/Professionals';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="mood" element={<MoodTracker />} />
            <Route path="exercise" element={<ExerciseTracker />} />
            <Route path="resources" element={<Resources />} />
            <Route path="professionals" element={<Professionals />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App; 