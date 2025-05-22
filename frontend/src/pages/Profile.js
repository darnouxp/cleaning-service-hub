import React from 'react';
import { Container, Typography, Paper, Grid, TextField, Button } from '@mui/material';

const Profile = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              type="email"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              margin="normal"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 