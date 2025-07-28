import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button,
  Typography,
  Paper,
  Fade,
  Avatar,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid
} from '@mui/material';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "Running", 
    duration: "", 
    caloriesBurned: "", 
    additionalMetrics: {}
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const activityTypes = [
    { value: 'Running', icon: '🏃‍♂️', color: '#ff5722' },
    { value: 'Walking', icon: '🚶‍♂️', color: '#4caf50' },
    { value: 'Cycling', icon: '🚴‍♂️', color: '#2196f3' },
    { value: 'Swimming', icon: '🏊‍♂️', color: '#00bcd4' },
    { value: 'Yoga', icon: '🧘‍♀️', color: '#9c27b0' },
    { value: 'Weightlifting', icon: '🏋️‍♂️', color: '#ff9800' },
    { value: 'Dancing', icon: '💃', color: '#e91e63' },
    { value: 'Hiking', icon: '🥾', color: '#795548' }
  ];

  const getActivityData = (type) => {
    return activityTypes.find(activity => activity.value === type) || activityTypes[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activity.duration || !activity.caloriesBurned) {
      setNotification({
        open: true,
        message: 'Please fill in all required fields!',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addActivity(activity);
      onActivityAdded();
      setActivity({ type: "Running", duration: "", caloriesBurned: "", additionalMetrics: {} });
      
      setNotification({
        open: true,
        message: 'Activity added successfully! 🎉',
        severity: 'success'
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: 'Failed to add activity. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const selectedActivity = getActivityData(activity.type);

  return (
    <Fade in timeout={600}>
      <Card sx={{ 
        maxWidth: 600,
        mx: 'auto',
        borderRadius: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        mb: 4
      }}>
        {/* Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 3,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              mr: 2, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              width: 56,
              height: 56,
              fontSize: '1.5rem'
            }}>
              💪
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Add New Activity
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Track your fitness journey
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Activity Type Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#424242' }}>
                Choose Activity Type
              </Typography>
              <Grid container spacing={2}>
                {activityTypes.map((activityType) => (
                  <Grid item xs={6} sm={4} md={3} key={activityType.value}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        border: activity.type === activityType.value ? 
                          `3px solid ${activityType.color}` : '2px solid transparent',
                        background: activity.type === activityType.value ? 
                          `linear-gradient(135deg, ${activityType.color}15 0%, ${activityType.color}25 100%)` : 
                          '#fafafa',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          background: `linear-gradient(135deg, ${activityType.color}15 0%, ${activityType.color}25 100%)`
                        }
                      }}
                      onClick={() => setActivity({...activity, type: activityType.value})}
                    >
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {activityType.icon}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: activity.type === activityType.value ? 700 : 500,
                          color: activity.type === activityType.value ? activityType.color : '#666'
                        }}
                      >
                        {activityType.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Selected Activity Display */}
            <Box sx={{ mb: 3 }}>
              <Paper sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${selectedActivity.color}15 0%, ${selectedActivity.color}25 100%)`,
                border: `2px solid ${selectedActivity.color}30`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h3" sx={{ mr: 2 }}>
                    {selectedActivity.icon}
                  </Typography>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: selectedActivity.color }}>
                      Selected: {selectedActivity.value}
                    </Typography>
                    <Chip 
                      label="Active Selection" 
                      size="small"
                      sx={{ 
                        backgroundColor: selectedActivity.color,
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Duration Input */}
            <Box sx={{ mb: 3 }}>
              <TextField 
                fullWidth
                label="Duration"
                type="number"
                value={activity.duration}
                onChange={(e) => setActivity({...activity, duration: e.target.value})}
                required
                InputProps={{
                  endAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        ⏱️ minutes
                      </Typography>
                    </Box>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: selectedActivity.color,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: selectedActivity.color,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: selectedActivity.color,
                  }
                }}
              />
            </Box>

            {/* Calories Input */}
            <Box sx={{ mb: 4 }}>
              <TextField 
                fullWidth
                label="Calories Burned"
                type="number"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}
                required
                InputProps={{
                  endAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        🔥 kcal
                      </Typography>
                    </Box>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: selectedActivity.color,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: selectedActivity.color,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: selectedActivity.color,
                  }
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: `linear-gradient(135deg, ${selectedActivity.color} 0%, ${selectedActivity.color}dd 100%)`,
                boxShadow: `0 8px 25px ${selectedActivity.color}40`,
                textTransform: 'none',
                '&:hover': {
                  background: `linear-gradient(135deg, ${selectedActivity.color}dd 0%, ${selectedActivity.color}bb 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 35px ${selectedActivity.color}50`,
                },
                '&:disabled': {
                  background: '#ccc',
                  color: '#999'
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <Box sx={{ 
                    width: 20, 
                    height: 20, 
                    border: '2px solid #fff', 
                    borderTop: '2px solid transparent', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite',
                    mr: 2,
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} />
                  Adding Activity...
                </>
              ) : (
                <>
                  ✨ Add Activity
                </>
              )}
            </Button>
          </Box>
        </CardContent>

        {/* Notification */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={4000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Card>
    </Fade>
  );
};

export default ActivityForm;