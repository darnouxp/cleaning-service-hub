import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const services = [
  {
    title: 'General Cleaning',
    description: 'Regular maintenance cleaning for your home or office',
    image: '/images/services/general-cleaning.png',
  },
  {
    title: 'Deep Cleaning',
    description: 'Thorough cleaning for special occasions or moving',
    image: '/images/services/deep-cleaning.jpg',
  },
  {
    title: 'Move In/Out Cleaning',
    description: 'Our special short term rental comprehensive cleaning service (compliant with AirBnb, Booking.com, etc.) and property transition cleaning service',
    image: '/images/services/move-cleaning.png',
  },
  {
    title: 'Post-Construction',
    description: 'Specialized cleaning after renovation or construction',
    image: '/images/services/post-construction.png',
  },
  {
    title: 'Exterior Cleaning',
    description: 'Pressure washing, window cleaning, and outdoor maintenance services',
    image: '/images/services/exterior-cleaning.png',
  },
  {
    title: 'Pool Cleaning',
    description: 'Professional pool maintenance and cleaning services',
    image: '/images/services/pool-cleaning.jpg',
  },  
  {
    title: 'Maid Services',
    description: 'We take care of your laundry and ironing.',
    image: '/images/services/laundry-cleaning.png',
  },  
  {
    title: 'Appliance Cleaning',
    description: 'Let us deep clean your appliances',
    image: '/images/services/appliance-cleaning.png',
  },
];

const ServiceCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Create a circular array for smooth infinite scrolling
  const getVisibleServices = () => {
    const result = [];
    const totalItems = services.length;
    
    // Add previous items
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + totalItems) % totalItems;
      result.push({
        ...services[index],
        position: i,
      });
    }
    
    return result;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const handleBack = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: '500px',
        }}
      >
        {getVisibleServices().map((service, index) => (
          <Card
            key={`${service.title}-${index}`}
            sx={{
              position: 'absolute',
              width: '300px',
              transition: 'all 0.5s ease-in-out',
              transform: `
                translateX(${service.position * 320}px)
                scale(${service.position === 0 ? 1 : 0.8})
              `,
              opacity: service.position === 0 ? 1 : 0.7,
              zIndex: service.position === 0 ? 2 : 1,
              '&:hover': {
                transform: `
                  translateX(${service.position * 320}px)
                  scale(${service.position === 0 ? 1.05 : 0.8})
                `,
                zIndex: 3,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={service.image}
              alt={service.title}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {service.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {service.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
            boxShadow: 1,
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
            boxShadow: 1,
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ServiceCarousel; 