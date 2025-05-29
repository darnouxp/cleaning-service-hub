import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CleaningServices,
  Star,
  Security,
  Support,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ServiceCarousel from '../components/ServiceCarousel';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const services = [
    {
      title: 'General Cleaning',
      description: 'Regular maintenance cleaning for your home or office',
      icon: <CleaningServices sx={{ fontSize: 40 }} />
    },
    {
      title: 'Deep Cleaning',
      description: 'Thorough cleaning for special occasions or moving',
      icon: <CleaningServices sx={{ fontSize: 40 }} />
    },
    {
      title: 'Move In/Out Cleaning',
      description: 'Comprehensive cleaning for property transitions',
      icon: <CleaningServices sx={{ fontSize: 40 }} />
    },
    {
      title: 'Post-Construction',
      description: 'Specialized cleaning after renovation or construction',
      icon: <CleaningServices sx={{ fontSize: 40 }} />
    },
    {
      title: 'Pool Cleaning',
      description: 'Professional pool maintenance and cleaning services',
      icon: <CleaningServices sx={{ fontSize: 40 }} />
    }
  ];

  const features = [
    {
      title: 'Professional Cleaners',
      description: 'Our cleaners are thoroughly vetted and professionally trained',
      icon: <Star sx={{ fontSize: 40 }} />
    },
    {
      title: 'Secure Booking',
      description: 'Safe and secure payment processing for all bookings',
      icon: <Security sx={{ fontSize: 40 }} />
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs',
      icon: <Support sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <Box>
      {/* Logo and Company Name Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 2 }}>
        <Box
          component="img"
          src="/images/logo.png"
          alt="5 Fairies Cleaning Services Logo"
          sx={{ height: 240, mb: 1 }}
        />

      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          height: '80vh'
        }}
      >
        <Box
          component="img"
          src="/images/cleaning-hero.jpg"
          alt="Professional Cleaning"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            filter: 'brightness(0.7)'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 24 }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
              <Typography variant="h2" component="h1" gutterBottom>
                Professional Cleaning Services
              </Typography>
              <Typography variant="h5" paragraph>
                Book trusted cleaning professionals for your home or office
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/quotations')}
                  sx={{
                    fontSize: '1.5rem',
                    padding: '16px 48px',
                    minWidth: '300px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Let's get started! <br />
                  <span style={{ fontSize: '1rem', fontWeight: 400 }}>60 seconds booking process</span>
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Choose from our range of professional cleaning services
        </Typography>
        <ServiceCarousel />
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Why Choose Us
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
             {/* Logo and Company Name Section */}
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'left', mt: 4, mb: 2 }}>
                <Box
                  component="img"
                  src="/images/logo.jpg"
                  alt="5 Fairies Cleaning Services Logo"
                  sx={{ height: 120, mb: 1 }}
                />
              </Box>       
              <Typography variant="body2">
                Professional cleaning services for your home and office.
                Quality service, trusted professionals.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register', { state: { role: 'MAID' } })}
                sx={{
                  color: 'white',
                  backgroundColor: 'purple',
                  borderColor: 'purple',
                  '&:hover': {
                    backgroundColor: 'darkviolet',
                    borderColor: 'darkviolet',
                  },
                }}
              >
                Become a Cleaner
              </Button>


            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton color="inherit">
                  <Facebook />
                </IconButton>
                <IconButton color="inherit">
                  <Twitter />
                </IconButton>
                <IconButton color="inherit">
                  <Instagram />
                </IconButton>
                <IconButton color="inherit">
                  <LinkedIn />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} 5 Fairies Cleaning Services. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 