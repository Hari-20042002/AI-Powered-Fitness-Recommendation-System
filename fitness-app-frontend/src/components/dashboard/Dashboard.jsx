import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  AppBar, 
  Toolbar, 
  Avatar, 
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FitnessCenter,
  Analytics,
  Person,
  Logout,
  Menu as MenuIcon,
  TrendingUp,
  Timer,
  LocalFireDepartment,
  CalendarToday,
  Add as AddIcon
} from '@mui/icons-material';
import ActivityList from '../ActivityList';
import ActivityForm from '../ActivityForm';
import { getActivities } from '../../services/api';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeView, setActiveView] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    setMobileOpen(false);
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleActivityAdded = () => {
    fetchActivities();
    setShowAddActivity(false);
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'activities', label: 'Activities', icon: <FitnessCenter /> },
    { id: 'analytics', label: 'Analytics', icon: <Analytics /> },
    { id: 'profile', label: 'Profile', icon: <Person /> }
  ];

  const statsData = [
    { 
      label: 'Total Activities', 
      value: activities.length.toString(), 
      change: '+12%', 
      icon: <TrendingUp />, 
      color: '#667eea' 
    },
    { 
      label: 'This Week', 
      value: activities.filter(a => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(a.createdAt) > weekAgo;
      }).length.toString(), 
      change: '+3', 
      icon: <CalendarToday />, 
      color: '#43e97b' 
    },
    { 
      label: 'Calories Burned', 
      value: activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0).toString(), 
      change: '+18%', 
      icon: <LocalFireDepartment />, 
      color: '#fa709a' 
    },
    { 
      label: 'Active Days', 
      value: '5', 
      change: '+2', 
      icon: <Timer />, 
      color: '#4facfe' 
    }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
          Fitness Tracker
        </Typography>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            button
            onClick={() => handleViewChange(item.id)}
            sx={{
              backgroundColor: activeView === item.id ? 'rgba(103, 126, 234, 0.1)' : 'transparent',
              color: activeView === item.id ? '#667eea' : 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(103, 126, 234, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: activeView === item.id ? '#667eea' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewContent statsData={statsData} activities={activities} loading={loading} />;
      case 'activities':
        return <ActivityList />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'profile':
        return <ProfileContent user={user} onLogout={handleLogout} />;
      default:
        return <OverviewContent statsData={statsData} activities={activities} loading={loading} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: 250, position: 'relative' },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* App Bar */}
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {navigationItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#667eea' }}>
                <Person />
              </Avatar>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.name || 'User'}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f8fafc' }}>
          {renderContent()}
        </Box>
      </Box>

      {/* Floating Action Button for Add Activity */}
      <Fab
        color="primary"
        aria-label="add activity"
        onClick={() => setShowAddActivity(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            transform: 'scale(1.1)',
          }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add Activity Dialog */}
      <Dialog
        open={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700
        }}>
          Add New Activity
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <ActivityForm onActivityAdded={handleActivityAdded} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const OverviewContent = ({ statsData, activities, loading }) => (
  <Container maxWidth="lg">
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1f2937' }}>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Track your fitness progress and activities
      </Typography>
    </Box>

    {/* Stats Grid */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 500 }}>
                    {stat.change}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: `${stat.color}15`,
                  color: stat.color 
                }}>
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Recent Activities */}
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Recent Activities
        </Typography>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Loading activities...
            </Typography>
          </Box>
        ) : (
          <ActivityList />
        )}
      </CardContent>
    </Card>
  </Container>
);

const AnalyticsContent = () => (
  <Container maxWidth="lg">
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Detailed insights about your fitness journey
      </Typography>
    </Box>
    
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 6, textAlign: 'center' }}>
        <Analytics sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Analytics Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed analytics and insights will be available soon.
        </Typography>
      </CardContent>
    </Card>
  </Container>
);

const ProfileContent = ({ user, onLogout }) => (
  <Container maxWidth="lg">
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your account settings
      </Typography>
    </Box>
    
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 64, height: 64, mr: 3, bgcolor: '#667eea' }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user?.name || 'User Name'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Edit Profile
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Change Password
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="error" 
              fullWidth 
              onClick={onLogout}
              startIcon={<Logout />}
            >
              Sign Out
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Container>
);

export default Dashboard; 