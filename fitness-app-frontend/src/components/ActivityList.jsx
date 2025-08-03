import { Card, CardContent, Grid, Typography, Box, Container, Chip, Avatar, Skeleton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../services/api';
import { 
  DirectionsRun, 
  FitnessCenter, 
  DirectionsBike, 
  Pool,
  SelfImprovement,
  SportsTennis,
  LocalFireDepartment,
  AccessTime,
  TrendingUp,
  Speed
} from '@mui/icons-material';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const getActivityIcon = (type) => {
        const iconMap = {
            'running': DirectionsRun,
            'weight training': FitnessCenter,
            'cycling': DirectionsBike,
            'swimming': Pool,
            'yoga': SelfImprovement,
            'tennis': SportsTennis
        };
        const IconComponent = iconMap[type?.toLowerCase()] || FitnessCenter;
        return <IconComponent sx={{ fontSize: 30 }} />;
    };

    const getGradientBackground = (type) => {
        const gradients = {
            'running': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'weight training': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'cycling': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'swimming': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'yoga': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'tennis': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        };
        return gradients[type?.toLowerCase()] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };

    const fetchActivity = async () => {
        try{
           const response = await getActivities();
           console.log('Activities fetched:', response.data);
           setActivities(response.data);
           setLoading(false);
        }catch(error){
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchActivity()
    },[])

    const LoadingSkeleton = () => (
        <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card 
                        sx={{ 
                            borderRadius: 4,
                            overflow: 'hidden',
                            height: 400
                        }}
                    >
                        <Skeleton variant="rectangular" height={150} />
                        <Box sx={{ p: 3 }}>
                            <Skeleton variant="text" height={32} width="60%" sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
                            <Skeleton variant="text" height={24} width="40%" />
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            mb: 2, 
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Your Activities
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
                        Track your fitness journey with beautiful insights
                    </Typography>
                </Box>
                <LoadingSkeleton />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                        mb: 2, 
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Your Activities
                </Typography>
                
                <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ mb: 4, fontWeight: 300 }}
                >
                    Track your fitness journey with beautiful insights
                </Typography>

                {/* Stats Summary - Only show if activities exist */}
                {activities.length > 0 && (
                    <Grid container spacing={2} sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                        <Grid item xs={4}>
                            <Box sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {activities.length}
                                </Typography>
                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Activities
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0)}
                                </Typography>
                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Calories
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {activities.reduce((sum, activity) => sum + (activity.duration || 0), 0)}m
                                </Typography>
                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Total Time
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Box>

            {/* Activities Grid */}
            <Grid container spacing={3}>
                {activities.map((activity, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={activity.id}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                borderRadius: 4,
                                overflow: 'hidden',
                                height: '100%',
                                position: 'relative',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: 'translateY(0)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                                },
                                animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                                '@keyframes slideUp': {
                                    '0%': {
                                        opacity: 0,
                                        transform: 'translateY(30px)',
                                    },
                                    '100%': {
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                    },
                                },
                            }}
                            onClick={() => {
                                console.log('Navigating to activity:', activity.id, activity);
                                navigate(`/activities/${activity.id}`);
                            }}
                        >
                            {/* Gradient Header */}
                            <Box 
                                sx={{ 
                                    height: 150,
                                    background: getGradientBackground(activity.type),
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        '& .MuiSvgIcon-root': {
                                            color: 'white'
                                        }
                                    }}
                                >
                                    {getActivityIcon(activity.type)}
                                </Avatar>
                                
                                {/* Decorative Elements */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -16,
                                        right: -16,
                                        width: 96,
                                        height: 96,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        filter: 'blur(20px)'
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: -8,
                                        left: -8,
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        filter: 'blur(16px)'
                                    }}
                                />
                            </Box>

                            <CardContent sx={{ p: 3, height: 'calc(100% - 150px)', display: 'flex', flexDirection: 'column' }}>
                                <Typography 
                                    variant='h5' 
                                    component="h2" 
                                    sx={{ 
                                        mb: 3,
                                        fontWeight: 600,
                                        color: 'text.primary'
                                    }}
                                >
                                    {activity.type}
                                </Typography>

                                {/* Stats Grid */}
                                <Grid container spacing={2} sx={{ mb: 3, flexGrow: 1 }}>
                                    <Grid item xs={6}>
                                        <Box 
                                            sx={{ 
                                                p: 2,
                                                bgcolor: 'rgba(103, 126, 234, 0.1)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(103, 126, 234, 0.2)',
                                                textAlign: 'center',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <AccessTime sx={{ color: '#667eea', fontSize: 24, mb: 1 }} />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                                                DURATION
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
                                                {activity.duration}m
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Box 
                                            sx={{ 
                                                p: 2,
                                                bgcolor: 'rgba(244, 67, 54, 0.1)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(244, 67, 54, 0.2)',
                                                textAlign: 'center',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <LocalFireDepartment sx={{ color: '#f44336', fontSize: 24, mb: 1 }} />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                                                CALORIES
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#f44336' }}>
                                                {activity.caloriesBurned}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Action Indicator */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Click to view details
                                    </Typography>
                                    <Box 
                                        sx={{ 
                                            width: 32, 
                                            height: 32, 
                                            bgcolor: 'rgba(103, 126, 234, 0.1)', 
                                            borderRadius: '50%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: '#667eea',
                                                '& .MuiSvgIcon-root': {
                                                    color: 'white'
                                                }
                                            }
                                        }}
                                    >
                                        <TrendingUp sx={{ fontSize: 16, color: '#667eea', transition: 'color 0.3s ease' }} />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Empty State */}
            {activities.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
                        🏃‍♂️
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                        No activities yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                        Start your fitness journey today! Add your first activity to see it appear here with beautiful insights.
                    </Typography>
                </Box>
            )}
        </Container>
    )
}

export default ActivityList