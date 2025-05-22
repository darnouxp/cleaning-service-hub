import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardActionArea,
  CardContent,
  useMediaQuery,
  useTheme,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from '@mui/material';
import {
  CleaningServices,
  Home,
  Business,
  Pool,
  Deck,
  Construction,
  MeetingRoom,
  LocalCarWash,
  Shield
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import QuoteSummaryCard from './QuoteSummaryCard';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import EditableInvoiceQuoteCard from './EditableInvoiceQuoteCard';

const cleaningTypes = [
  { value: 'GENERAL_CLEANING', label: 'General Cleaning', icon: <CleaningServices fontSize="large" /> },
  { value: 'DEEP_CLEANING', label: 'Deep Cleaning', icon: <LocalCarWash fontSize="large" /> },
  { value: 'POST_CONSTRUCTION', label: 'Post-Construction', icon: <Construction fontSize="large" /> },
  { value: 'MOVE_IN_OUT', label: 'Move In/Out', icon: <MeetingRoom fontSize="large" /> },
  { value: 'OFFICE', label: 'Office/Commercial', icon: <Business fontSize="large" /> },
  { value: 'POOL_CLEANING', label: 'Pool Cleaning', icon: <Pool fontSize="large" /> },
  { value: 'EXTERIOR_CLEANING', label: 'Exteriors Cleaning', icon: <Deck fontSize="large" /> },
];

const propertyTypes = [
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'OTHER', label: 'Other' },
];

const frequencyOptions = [
  { label: 'One-time', value: 'ONE_TIME' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Bi-weekly', value: 'BIWEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
];

const extrasOptions = [
  'Inside the Fridge',
  'Inside the Oven',
  'Inside Windows - 30 Min',
  'Load of Laundry (Max 2 Loads)',
  'Inside Cabinets',
  'Wet Wiping Baseboards',
  'Ceiling Fans',
  'Wet Wipe Blinds',
  'Walls',
  'Home Organization (per hour)'
];

const steps = [
  'Type of Cleaning',
  'Property Details',
  'Frequency',
  'Extras',
  'Contact Info',
  'Date & Time',
  'Special Requests',
  'Book',
];

const squareFootageOptions = [
  { label: 'Less than 500 sq ft', value: '<500' },
  { label: '500 - 999 sq ft', value: '500-999' },
  { label: '1,000 - 1,499 sq ft', value: '1000-1499' },
  { label: '1,500 - 1,999 sq ft', value: '1500-1999' },
  { label: '2,000 - 2,499 sq ft', value: '2000-2499' },
  { label: '2,500 - 2,999 sq ft', value: '2500-2999' },
  { label: '3,000+ sq ft', value: '3000+' },
];

const stripePromise = loadStripe('pk_test_51NwQ...your_test_key_here'); // Replace with your test key

const StripePaymentForm = ({ amount, onSuccess, onError, disabled, bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    try {
      // Simulate fetching clientSecret from backend using bookingId
      // In production, fetch from `/api/payments/create-intent?bookingId=...`
      const clientSecret = 'sk_test_dummy_client_secret';
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        onError && onError(result.error.message);
      } else {
        setProcessing(false);
        onSuccess && onSuccess();
      }
    } catch (err) {
      setError('Payment failed.');
      setProcessing(false);
      onError && onError('Payment failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2 }}>
        <Typography variant='body2' sx={{ mb: 1 }}>Card Details</Typography>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#c23d4b' },
            },
          }}
          onChange={e => setCardComplete(e.complete)}
        />
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{ fontSize: '1.2rem', py: 2, mt: 2 }}
        disabled={processing || !cardComplete || disabled}
      >
        {processing ? 'Processing...' : `Confirm & Book My Cleaning for $${amount}`}
      </Button>
    </form>
  );
};

const QuotationRequest = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    serviceType: [],
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: '',
    poolSize: '',
    exteriorFlooringSize: '',
    yardSize: '',
    frequency: '',
    extras: [],
    address: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    specialInstructions: '',
    isRecurring: false,
    recurringPattern: null,
    guestName: '',
    guestEmail: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showRegister, setShowRegister] = useState(false);
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardComplete, setCardComplete] = useState(false);
  const [booking, setBooking] = useState(false);

  const isPoolCleaning = Array.isArray(formData.serviceType) ? formData.serviceType.includes('POOL_CLEANING') : formData.serviceType === 'POOL_CLEANING';
  const isExteriorCleaning = Array.isArray(formData.serviceType) ? formData.serviceType.includes('EXTERIOR_CLEANING') : formData.serviceType === 'EXTERIOR_CLEANING';

  // Step navigation
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Step 1: Card selection
  const handleServiceTypeSelect = (value) => {
    setFormData((prev) => {
      const selected = prev.serviceType.includes(value)
        ? prev.serviceType.filter((v) => v !== value)
        : [...prev.serviceType, value];
      return { ...prev, serviceType: selected };
    });
  };

  // Step 2: Property details change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Step 1: Type of Cleaning
  const renderStep1 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Select the type(s) of cleaning you need:</Typography>
      <Grid container spacing={2}>
        {cleaningTypes.map((type) => (
          <Grid item xs={6} sm={4} md={3} key={type.value}>
            <Card
              sx={{
                border: formData.serviceType.includes(type.value)
                  ? `2px solid ${theme.palette.primary.main}`
                  : '1px solid #eee',
                boxShadow: formData.serviceType.includes(type.value) ? 4 : 1,
                bgcolor: formData.serviceType.includes(type.value)
                  ? theme.palette.primary.light + '22'
                  : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => handleServiceTypeSelect(type.value)}
            >
              <CardActionArea sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, px: 1 }}>
                  {type.icon}
                  <Typography variant="subtitle1" sx={{ mt: 1, textAlign: 'center', wordBreak: 'break-word', fontSize: { xs: '1rem', sm: '1.1rem' }, maxWidth: 110 }}>
                    {type.label}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Step 2: Property Details
  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Tell us about your property:</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
            >
              {propertyTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Conditionally render these based on propertyType/cleaningType */}
        <Grid item xs={6} sm={3}>
          <TextField
            label="Bedrooms"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="Bathrooms"
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Square Footage</InputLabel>
            <Select
              name="squareFootage"
              value={formData.squareFootage}
              onChange={handleChange}
              label="Square Footage"
            >
              {squareFootageOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Add Pool Size, Yard Size, etc. as needed */}
      </Grid>
    </Box>
  );

  // Step 3: Frequency
  const renderStep3 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>How often do you need cleaning?</Typography>
      <Grid container spacing={2}>
        {frequencyOptions.map(option => (
          <Grid item xs={6} sm={3} key={option.value}>
            <Button
              variant={formData.frequency === option.value ? 'contained' : 'outlined'}
              color="primary"
              fullWidth
              sx={{ py: 2, fontWeight: 600 }}
              onClick={() => setFormData(prev => ({ ...prev, frequency: option.value }))}
            >
              {option.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Step 4: Extras
  const renderStep4 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Would you like to add any extras?</Typography>
      <Grid container spacing={2}>
        {extrasOptions.map(extra => (
          <Grid item xs={12} sm={6} md={4} key={extra}>
            <Button
              variant={formData.extras.includes(extra) ? 'contained' : 'outlined'}
              color="primary"
              fullWidth
              sx={{ py: 2, fontWeight: 500, textTransform: 'none' }}
              onClick={() => setFormData(prev => ({
                ...prev,
                extras: prev.extras.includes(extra)
                  ? prev.extras.filter(e => e !== extra)
                  : [...prev.extras, extra]
              }))}
            >
              {extra}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Step 5: Address & Contact Info
  const renderStep5 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Where should we clean and how can we contact you?</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Placeholder for Google Autocomplete */}
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            type="email"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone (optional)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Step 6: Preferred Date & Time
  const renderStep6 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>When would you like the cleaning?</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Preferred Date"
            name="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Preferred Time</InputLabel>
            <Select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              label="Preferred Time"
            >
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="afternoon">Afternoon</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  // Step 7: Special Instructions
  const renderStep7 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Any special instructions?</Typography>
      <TextField
        label="Special Instructions (allergies, pets, access code, etc.)"
        name="specialInstructions"
        value={formData.specialInstructions}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        placeholder="Optional"
      />
    </Box>
  );

  const handleEditSection = (stepIndex) => setActiveStep(stepIndex);

  // Step 8: Review & Book
  const renderStep8 = () => (
    <Box>
      <EditableInvoiceQuoteCard
        formData={formData}
        getEstimate={getEstimate}
        editable={true}
        onEditSection={handleEditSection}
      />
      {/* Trust & Guarantee Banner */}
      <Box sx={{ my: 3, p: 2, bgcolor: 'success.lighter', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Shield color='success' />
        <Typography fontWeight={600}>100% Satisfaction Guarantee – or your money back!</Typography>
      </Box>
      {/* Payment Method Selection */}
      <FormControl component='fieldset' sx={{ mb: 2 }}>
        <FormLabel component='legend'>Payment Method</FormLabel>
        <RadioGroup row value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <FormControlLabel value='card' control={<Radio />} label='Credit Card' />
          <FormControlLabel value='cash' control={<Radio />} label='Cash' />
        </RadioGroup>
      </FormControl>
      {/* Stripe Elements for Credit Card */}
      {paymentMethod === 'card' && (
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            amount={((Number(getEstimate() || 0) * 1.07).toFixed(2))}
            onSuccess={() => setSuccess('Payment successful!')}
            onError={msg => setError(msg)}
            disabled={booking}
            // bookingId={bookingId} // Pass if you want to use booking ID
          />
        </Elements>
      )}
      {paymentMethod === 'cash' && (
        <Button
          variant='contained'
          color='primary'
          size='large'
          fullWidth
          sx={{ fontSize: '1.2rem', py: 2, mt: 2 }}
          disabled={booking}
          onClick={handleBook}
        >
          Confirm & Book My Cleaning for ${((Number(getEstimate() || 0) * 1.07).toFixed(2))}
        </Button>
      )}
    </Box>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    // Prepare the data to send
    const dataToSend = {
      ...formData,
      ...(isPoolCleaning && {
        bedrooms: undefined,
        bathrooms: undefined,
        squareFootage: undefined
      }),
      ...(user ? {} : { guestName: formData.guestName, guestEmail: formData.guestEmail })
    };

    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (user) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quotations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setValidationErrors(
            data.details.reduce((acc, err) => ({
              ...acc,
              [err.param]: err.msg
            }), {})
          );
        } else {
          setError(data.error || 'Failed to request quotation');
        }
        return;
      }

      setSuccess('Quotation request submitted successfully!');
      setFormData({
        serviceType: [],
        propertyType: '',
        bedrooms: 1,
        bathrooms: 1,
        squareFootage: '',
        poolSize: '',
        exteriorFlooringSize: '',
        yardSize: '',
        frequency: '',
        extras: [],
        address: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        specialInstructions: '',
        isRecurring: false,
        recurringPattern: null,
        guestName: '',
        guestEmail: '',
      });
      // If guest, show registration prompt
      if (!user) setShowRegister(true);
    } catch (error) {
      setError('An error occurred while submitting the quotation request');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.guestName,
          email: formData.guestEmail,
          password: registerPassword,
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setRegisterError(data.error || 'Registration failed');
        return;
      }
      setRegisterSuccess('Account created! You can now log in to manage your bookings.');
      setShowRegister(false);
    } catch (err) {
      setRegisterError('An error occurred during registration.');
    }
  };

  // Pricing estimation logic
  const getEstimate = () => {
    const { serviceType, bedrooms, bathrooms, squareFootage, poolSize, exteriorFlooringSize, yardSize } = formData;
    if (!serviceType || serviceType.length === 0) return null;
    let estimate = 0;
    (Array.isArray(serviceType) ? serviceType : [serviceType]).forEach(type => {
      switch (type) {
        case 'GENERAL_CLEANING':
          estimate += 50 + (Number(bedrooms) || 0) * 15 + (Number(bathrooms) || 0) * 10;
          break;
        case 'DEEP_CLEANING':
          estimate += 100 + (Number(bedrooms) || 0) * 20 + (Number(bathrooms) || 0) * 15;
          break;
        case 'MOVE_IN_OUT':
          estimate += 120 + (Number(bedrooms) || 0) * 25 + (Number(bathrooms) || 0) * 20;
          break;
        case 'POST_CONSTRUCTION':
          estimate += 150 + (Number(squareFootage) || 0) * 0.2;
          break;
        case 'WINDOW_CLEANING':
          estimate += 60 + (Number(squareFootage) || 0) * 0.1;
          break;
        case 'POOL_CLEANING':
          estimate += 80 + (Number(poolSize) || 0) * 0.25;
          break;
        case 'EXTERIOR_CLEANING':
          estimate += 90 + (Number(exteriorFlooringSize) || 0) * 0.15 + (Number(yardSize) || 0) * 0.1;
          break;
        default:
          break;
      }
    });
    return estimate > 0 ? estimate.toFixed(2) : null;
  };

  // Helper to determine if square footage should be shown
  const needsSquareFootage = () => {
    const types = Array.isArray(formData.serviceType) ? formData.serviceType : [formData.serviceType];
    return types.some(type => [
      'GENERAL_CLEANING',
      'DEEP_CLEANING',
      'MOVE_IN_OUT',
      'POST_CONSTRUCTION',
      'WINDOW_CLEANING',
    ].includes(type));
  };

  // Helper to determine if bedrooms/bathrooms should be shown
  const needsBedroomsBathrooms = () => {
    const types = Array.isArray(formData.serviceType) ? formData.serviceType : [formData.serviceType];
    return types.some(type => [
      'GENERAL_CLEANING',
      'DEEP_CLEANING',
      'MOVE_IN_OUT',
      'POST_CONSTRUCTION'
    ].includes(type));
  };

  const handleBook = async () => {
    setBooking(true);
    setError(null);
    // 1. Always create the booking/customer in the backend
    const dataToSend = {
      ...formData,
      ...(isPoolCleaning && {
        bedrooms: undefined,
        bathrooms: undefined,
        squareFootage: undefined
      }),
      ...(user ? {} : { guestName: formData.guestName, guestEmail: formData.guestEmail })
    };
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (user) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quotations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dataToSend)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to create booking');
        setBooking(false);
        return;
      }
      // Optionally, store booking/quote ID for payment
      // const bookingId = data.id;
      // For cash, show success
      setSuccess('Booking created! We will contact you soon.');
      setBooking(false);
    } catch (err) {
      setError('Failed to create booking');
      setBooking(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            <Paper elevation={3} sx={{ p: 4 }}>
              {/* Progress Indicator */}
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              {activeStep === 0 && renderStep1()}
              {activeStep === 1 && renderStep2()}
              {activeStep === 2 && renderStep3()}
              {activeStep === 3 && renderStep4()}
              {activeStep === 4 && renderStep5()}
              {activeStep === 5 && renderStep6()}
              {activeStep === 6 && renderStep7()}
              {activeStep === 7 && renderStep8()}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  color="primary"
                >
                  Back
                </Button>
                {/* Only show Next button if not on last step */}
                {activeStep < steps.length - 1 && (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 120 }}
                    disabled={
                      (activeStep === 0 && formData.serviceType.length === 0) ||
                      (activeStep === 1 && !formData.propertyType) ||
                      (activeStep === 2 && !formData.frequency) ||
                      (activeStep === 4 && (!formData.address || !formData.email)) ||
                      (activeStep === 5 && (!formData.preferredDate || !formData.preferredTime))
                    }
                  >
                    Next
                  </Button>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  {success}
                </Alert>
              )}

              {/* Post-booking registration for guests */}
              {showRegister && !user && (
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Create an account to manage your bookings and get updates
                  </Typography>
                  <form onSubmit={handleRegister}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={formData.guestName}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={formData.guestEmail}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Create Password"
                          type="password"
                          value={registerPassword}
                          onChange={e => setRegisterPassword(e.target.value)}
                        />
                      </Grid>
                      {registerError && (
                        <Grid item xs={12}>
                          <Alert severity="error">{registerError}</Alert>
                        </Grid>
                      )}
                      {registerSuccess && (
                        <Grid item xs={12}>
                          <Alert severity="success">{registerSuccess}</Alert>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                          Create Account
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            {/* Only show the floating quote summary card before the last step */}
            {activeStep < steps.length - 1 && (
              <QuoteSummaryCard formData={formData} getEstimate={getEstimate} />
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default QuotationRequest; 