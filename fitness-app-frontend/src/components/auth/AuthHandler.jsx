import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import { setCredentials } from '../../store/authSlice';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthHandler = ({ children }) => {
  const dispatch = useDispatch();
  const { token, loginInProgress, error, login, logOut } = useContext(AuthContext);

  useEffect(() => {
    // If we have a token, update the Redux store
    if (token) {
      console.log('AuthHandler: Token received:', token ? 'Present' : 'Missing');
      
      // Parse the token to get user info (this is a JWT token)
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log('AuthHandler: Token payload:', tokenPayload);
        
        const user = {
          sub: tokenPayload.sub,
          name: tokenPayload.name || tokenPayload.preferred_username || 'User',
          email: tokenPayload.email || '',
          picture: tokenPayload.picture || ''
        };
        
        console.log('AuthHandler: Setting credentials for user:', user);
        
        // Set both token and userId in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.sub);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch(setCredentials({ user, token }));
      } catch (error) {
        console.error('Error parsing token:', error);
        // If token parsing fails, logout
        logOut();
      }
    } else {
      console.log('AuthHandler: No token available');
    }
  }, [token, dispatch, logOut]);

  // Show loading state during login
  if (loginInProgress) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8fafc'
        }}
      >
        <CircularProgress size={40} sx={{ color: '#667eea', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Authenticating...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          p: 3
        }}
      >
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Authentication Error
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {error.message || 'An error occurred during authentication. Please try again.'}
        </Typography>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '12px 24px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          Retry
        </button>
      </Box>
    );
  }

  return children;
};

export default AuthHandler; 