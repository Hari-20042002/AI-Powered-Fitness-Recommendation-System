import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import './App.css';

// Lazy load components for better performance
const Login = lazy(() => import('./components/auth/Login'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const ActivityDetails = lazy(() => import('./components/ActivityDetails'));

// Simple loading component using Material-UI
const LoadingSpinner = () => (
  <Box 
    sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8fafc'
    }}
  >
    <CircularProgress size={40} sx={{ color: '#667eea' }} />
  </Box>
);

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/activities/:id" 
              element={isAuthenticated ? <ActivityDetails /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
            />
          </Routes>
        </Suspense>
      </Box>
    </Router>
  );
}

export default App;
