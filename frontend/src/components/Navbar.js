import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src="/images/logo.png"
              alt="Prime Shine Logo"
              sx={{
                height: 40,
                marginRight: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
              }}
            >
              Prime Shine
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user ? (
              <>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  color="inherit"
                >
                  Dashboard
                </Button>
                <Button
                  component={RouterLink}
                  to="/profile"
                  color="inherit"
                >
                  Profile
                </Button>
                <Button
                  onClick={logout}
                  color="inherit"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 