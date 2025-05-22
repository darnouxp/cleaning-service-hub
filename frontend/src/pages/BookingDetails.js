import React from 'react';
import { Container, Typography, Paper, Grid, Button } from '@mui/material';

const BookingDetails = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Booking Details
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Service Information
            </Typography>
            {/* Add service details here */}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            {/* Add customer details here */}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Edit Booking
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BookingDetails; 