import React from 'react';
import { Box, Container, Typography, IconButton, Stack, Button } from '@mui/material';
import { Phone, Email, Facebook, Twitter, Instagram, LinkedIn, LocationOn } from '@mui/icons-material';

const TopBar = () => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 20 }} />
              <Typography variant="body2">Orlando–Kissimmee</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 20 }} />
              <Typography variant="body2">(555) 123-4567</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ fontSize: 20 }} />
              <Typography variant="body2">contact@primeshine.com</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="inherit" size="small">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" size="small">
              <Twitter />
            </IconButton>
            <IconButton color="inherit" size="small">
              <Instagram />
            </IconButton>
            <IconButton color="inherit" size="small">
              <LinkedIn />
            </IconButton>
            <Button
              component={require('react-router-dom').Link}
              to="/login"
              color="inherit"
              variant="outlined"
              size="small"
              sx={{ ml: 2, borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.08)' } }}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default TopBar; 