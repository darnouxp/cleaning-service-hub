import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: location.state?.role || '',
    // Maid-specific fields
    hourlyRate: '',
    experience: '',
    services: [],
    serviceAreas: [],
    languages: [],
    otherLanguages: '',
    // Client-specific fields
    address: '',
    city: '',
    state: '',
    zipCode: '',
    preferredContactMethod: 'EMAIL'
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!formData.role) {
      navigate('/');
    }
  }, [formData.role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      if (error.response?.data?.details) {
        setValidationErrors(
          error.response.data.details.reduce((acc, err) => ({
            ...acc,
            [err.param]: err.msg
          }), {})
        );
      } else {
        setError(error.response?.data?.error || 'Failed to register');
      }
    }
  };

  const isMaid = formData.role === 'MAID';

  return (
    <>
      {/* Marketing CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #fef6f9, #e7f0fd)',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
          my: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#6a0dad',
            fontWeight: 700,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          ✨ Sparkling Clean, Stress-Free – Book Orlando's Top-Rated Cleaning Team!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.1rem',
            color: '#333',
            mb: 3,
          }}
        >
          Get your instant quote and see why locals trust 5 Fairies Cleaning Services for reliable, affordable, and satisfaction-guaranteed cleaning services.
        </Typography>
        <Button
          href="/quotations"
          sx={{
            backgroundColor: '#6a0dad',
            color: 'white',
            padding: '0.8rem 1.5rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(106, 13, 173, 0.08)',
            '&:hover': {
              backgroundColor: '#4b087a',
            },
          }}
        >
          Get My Free Quote
        </Button>
      </Box>
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              {isMaid ? 'Join as a Cleaning Professional' : 'Create Homeowner Account'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!validationErrors.firstName}
                    helperText={validationErrors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!validationErrors.lastName}
                    helperText={validationErrors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={!!validationErrors.phoneNumber}
                    helperText={validationErrors.phoneNumber}
                  />
                </Grid>

                {isMaid ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="hourlyRate"
                        label="Hourly Rate"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        error={!!validationErrors.hourlyRate}
                        helperText={validationErrors.hourlyRate}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="experience"
                        label="Years of Experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleChange}
                        error={!!validationErrors.experience}
                        helperText={validationErrors.experience}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!validationErrors.services}>
                        <InputLabel>Services Offered</InputLabel>
                        <Select
                          multiple
                          name="services"
                          value={formData.services}
                          onChange={handleChange}
                          renderValue={(selected) => selected.join(', ')}
                        >
                          <MenuItem value="GENERAL_CLEANING">General Cleaning</MenuItem>
                          <MenuItem value="DEEP_CLEANING">Deep Cleaning</MenuItem>
                          <MenuItem value="MOVE_IN_OUT">Move In/Out Cleaning</MenuItem>
                          <MenuItem value="POST_CONSTRUCTION">Post-Construction Cleaning</MenuItem>
                          <MenuItem value="WINDOW_CLEANING">Window Cleaning</MenuItem>
                          <MenuItem value="POOL_CLEANING">Pool Cleaning</MenuItem>
                        </Select>
                        {validationErrors.services && (
                          <Typography color="error" variant="caption">
                            {validationErrors.services}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!validationErrors.serviceAreas}>
                        <InputLabel>Service Areas</InputLabel>
                        <Select
                          multiple
                          name="serviceAreas"
                          value={formData.serviceAreas}
                          onChange={handleChange}
                          renderValue={(selected) => selected.join(', ')}
                        >
                          <MenuItem value="Downtown Orlando">Downtown Orlando</MenuItem>
                          <MenuItem value="Winter Park">Winter Park</MenuItem>
                          <MenuItem value="College Park">College Park</MenuItem>
                          <MenuItem value="Baldwin Park">Baldwin Park</MenuItem>
                          <MenuItem value="Lake Nona">Lake Nona</MenuItem>
                          <MenuItem value="Dr. Phillips">Dr. Phillips</MenuItem>
                          <MenuItem value="Windermere">Windermere</MenuItem>
                          <MenuItem value="Celebration">Celebration</MenuItem>
                          <MenuItem value="Kissimmee">Kissimmee</MenuItem>
                          <MenuItem value="Poinciana">Poinciana</MenuItem>
                          <MenuItem value="St. Cloud">St. Cloud</MenuItem>
                          <MenuItem value="Hunter's Creek">Hunter's Creek</MenuItem>
                          <MenuItem value="MetroWest">MetroWest</MenuItem>
                          <MenuItem value="Universal Area">Universal Area</MenuItem>
                          <MenuItem value="Disney Area">Disney Area</MenuItem>
                          <MenuItem value="International Drive">International Drive</MenuItem>
                          <MenuItem value="Millenia">Millenia</MenuItem>
                          <MenuItem value="Waterford Lakes">Waterford Lakes</MenuItem>
                          <MenuItem value="Avalon Park">Avalon Park</MenuItem>
                          <MenuItem value="Oviedo">Oviedo</MenuItem>
                        </Select>
                        {validationErrors.serviceAreas && (
                          <Typography color="error" variant="caption">
                            {validationErrors.serviceAreas}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!validationErrors.languages}>
                        <InputLabel>Languages Spoken</InputLabel>
                        <Select
                          multiple
                          name="languages"
                          value={formData.languages}
                          onChange={handleChange}
                          renderValue={(selected) => selected.join(', ')}
                        >
                          <MenuItem value="ENGLISH">English</MenuItem>
                          <MenuItem value="SPANISH">Spanish</MenuItem>
                          <MenuItem value="ITALIAN">Italian</MenuItem>
                          <MenuItem value="FRENCH">French</MenuItem>
                          <MenuItem value="CHINESE">Chinese</MenuItem>
                          <MenuItem value="RUSSIAN">Russian</MenuItem>
                          <MenuItem value="OTHER">Other</MenuItem>
                        </Select>
                        {validationErrors.languages && (
                          <Typography color="error" variant="caption">
                            {validationErrors.languages}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    {formData.languages.includes('OTHER') && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="otherLanguages"
                          label="Please specify other languages"
                          value={formData.otherLanguages}
                          onChange={handleChange}
                          error={!!validationErrors.otherLanguages}
                          helperText={validationErrors.otherLanguages || "List any additional languages you speak, separated by commas"}
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="address"
                        label="Address"
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        error={!!validationErrors.address}
                        helperText={validationErrors.address}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="city"
                        label="City"
                        value={formData.city}
                        onChange={handleChange}
                        error={!!validationErrors.city}
                        helperText={validationErrors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        required
                        fullWidth
                        name="state"
                        label="State"
                        value={formData.state}
                        onChange={handleChange}
                        error={!!validationErrors.state}
                        helperText={validationErrors.state}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        required
                        fullWidth
                        name="zipCode"
                        label="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                        error={!!validationErrors.zipCode}
                        helperText={validationErrors.zipCode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!validationErrors.preferredContactMethod}>
                        <InputLabel>Preferred Contact Method</InputLabel>
                        <Select
                          name="preferredContactMethod"
                          value={formData.preferredContactMethod}
                          onChange={handleChange}
                        >
                          <MenuItem value="EMAIL">Email</MenuItem>
                          <MenuItem value="PHONE">Phone</MenuItem>
                          <MenuItem value="SMS">SMS</MenuItem>
                        </Select>
                        {validationErrors.preferredContactMethod && (
                          <Typography color="error" variant="caption">
                            {validationErrors.preferredContactMethod}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Register; 