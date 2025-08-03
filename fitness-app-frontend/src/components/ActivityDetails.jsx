import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getActivityDetail, getActivityRecommendation } from '../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Avatar,
  Skeleton,
  Paper,
  IconButton,
  Fade,
  LinearProgress,
  Alert,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching activity with ID:', id);
        
        const response = await getActivityDetail(id);
        console.log('Activity response:', response);
        
        setActivity(response.data);
        
        // Fetch AI recommendation separately
        await fetchRecommendation();
        
      } catch (error) {
        console.error('Error fetching activity details:', error);
        console.error('Error response:', error.response);
        setError(error.response?.data?.message || 'Failed to load activity details');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendation = async () => {
      try {
        setRecommendationLoading(true);
        console.log('Fetching AI recommendation for activity ID:', id);
        
        const recommendationResponse = await getActivityRecommendation(id);
        console.log('Recommendation response:', recommendationResponse);
        
        setRecommendation(recommendationResponse.data);
        
      } catch (error) {
        console.error('Error fetching AI recommendation:', error);
        // Don't set error for recommendation failure, just log it
        console.log('Recommendation not available for this activity');
      } finally {
        setRecommendationLoading(false);
      }
    };

    if (id) {
      fetchActivityDetail();
    }
  }, [id]);

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'running':
      case 'jogging':
        return '🏃‍♂️';
      case 'cycling':
        return '🚴‍♂️';
      case 'swimming':
        return '🏊‍♂️';
      case 'weightlifting':
      case 'strength training':
        return '🏋️‍♂️';
      case 'yoga':
        return '🧘‍♀️';
      case 'walking':
        return '🚶‍♂️';
      default:
        return '💪';
    }
  };

  const getCalorieLevel = (calories) => {
    if (calories > 500) return { color: '#ff5722', level: 'High', progress: 100 };
    if (calories > 300) return { color: '#ff9800', level: 'Medium', progress: 70 };
    return { color: '#4caf50', level: 'Light', progress: 40 };
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        maxWidth: 1000, 
        mx: 'auto', 
        p: 3, 
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box sx={{ 
        maxWidth: 1000, 
        mx: 'auto', 
        p: 3, 
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          Activity not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const calorieInfo = getCalorieLevel(activity.caloriesBurned);

  return (
    <Box sx={{ 
      maxWidth: 1000, 
      mx: 'auto', 
      p: 3,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Fade in timeout={500}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ 
                mr: 2, 
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '1.5rem',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              ←
            </IconButton>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Activity Details
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Detailed insights into your fitness activity
          </Typography>
        </Box>
      </Fade>

      {/* Main Activity Card */}
      <Fade in timeout={700}>
        <Card sx={{ 
          mb: 3, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h1" sx={{ mr: 2, fontSize: '3rem' }}>
                {getActivityIcon(activity.type)}
              </Typography>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {activity.type}
                </Typography>
                <Chip 
                  label={new Date(activity.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  sx={{ 
                    mt: 1,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  height: '100%'
                }}>
                  <Typography variant="h1" sx={{ fontSize: '2.5rem', mb: 1 }}>⏱️</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {activity.duration}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Duration
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${calorieInfo.color} 0%, ${calorieInfo.color}dd 100%)`,
                  color: 'white',
                  height: '100%'
                }}>
                  <Typography variant="h1" sx={{ fontSize: '2.5rem', mb: 1 }}>🔥</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {activity.caloriesBurned}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Calories Burned
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={calorieInfo.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'white'
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.9 }}>
                      {calorieInfo.level} Intensity
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  color: 'white',
                  height: '100%'
                }}>
                  <Typography variant="h1" sx={{ fontSize: '2.5rem', mb: 1 }}>📅</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {new Date(activity.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Completed At
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* AI Recommendations */}
      <Fade in timeout={900}>
        <Card sx={{ 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
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
                🧠
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  AI Insights
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Personalized recommendations for your fitness journey
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            {recommendationLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    border: '3px solid #e3f2fd',
                    borderTop: '3px solid #1976d2',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>
                  Analyzing your activity...
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Our AI is generating personalized insights for your workout
                </Typography>
              </Box>
            ) : recommendation ? (
              <>
                {/* Analysis Section */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      mr: 2, 
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      fontSize: '1.2rem'
                    }}>
                      🔍
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      Analysis
                    </Typography>
                  </Box>
                  <Paper sx={{ 
                    p: 3, 
                    backgroundColor: '#f8f9ff',
                    borderLeft: '4px solid #1976d2',
                    borderRadius: 2
                  }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7,
                        fontSize: '1.1rem',
                        color: '#424242'
                      }}
                    >
                      {recommendation.recommendation || recommendation}
                    </Typography>
                  </Paper>
                </Box>

                {/* Improvements Section */}
                {recommendation?.improvements?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ 
                        mr: 2, 
                        backgroundColor: '#fff3e0',
                        color: '#f57c00',
                        fontSize: '1.2rem'
                      }}>
                        📈
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f57c00' }}>
                        Improvements
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {recommendation.improvements.map((improvement, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper sx={{ 
                            p: 3, 
                            backgroundColor: '#fff8f0',
                            borderLeft: '4px solid #f57c00',
                            borderRadius: 2,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateX(8px)'
                            }
                          }}>
                            <Typography 
                              variant="body1"
                              sx={{ 
                                lineHeight: 1.7,
                                color: '#424242'
                              }}
                            >
                              <strong>{index + 1}.</strong> {improvement}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Suggestions Section */}
                {recommendation?.suggestions?.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ 
                        mr: 2, 
                        backgroundColor: '#f3e5f5',
                        color: '#7b1fa2',
                        fontSize: '1.2rem'
                      }}>
                        💡
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                        Suggestions
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {recommendation.suggestions.map((suggestion, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper sx={{ 
                            p: 3, 
                            backgroundColor: '#faf5ff',
                            borderLeft: '4px solid #7b1fa2',
                            borderRadius: 2,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateX(8px)'
                            }
                          }}>
                            <Typography 
                              variant="body1"
                              sx={{ 
                                lineHeight: 1.7,
                                color: '#424242'
                              }}
                            >
                              <strong>💡</strong> {suggestion}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Safety Section */}
                {recommendation?.safety && (
                  <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ 
                        mr: 2, 
                        backgroundColor: '#ffebee',
                        color: '#d32f2f',
                        fontSize: '1.2rem'
                      }}>
                        ⚠️
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                        Safety Notes
                      </Typography>
                    </Box>
                    <Paper sx={{ 
                      p: 3, 
                      backgroundColor: '#fff5f5',
                      borderLeft: '4px solid #d32f2f',
                      borderRadius: 2
                    }}>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          lineHeight: 1.7,
                          color: '#424242'
                        }}
                      >
                        {recommendation.safety}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                  No AI recommendations available
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  AI insights will appear here when available for this activity
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default ActivityDetails;