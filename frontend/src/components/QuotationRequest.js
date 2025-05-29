import React, { useState, useEffect } from 'react';
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
  Shield,
  Build,
  Apartment,
  Kitchen,
  Microwave,
  Window,
  LocalLaundryService,
  BorderBottom,
  Toys,
  Blinds,
  FormatPaint,
  AccessTime,
  HomeWork
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import QuoteSummaryCard from './QuoteSummaryCard';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import EditableInvoiceQuoteCard from './EditableInvoiceQuoteCard';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const iconMap = {
  CleaningServices,
  Home,
  Business,
  Pool,
  Deck,
  Construction,
  MeetingRoom,
  LocalCarWash,
  Shield,
  Build,
  Apartment,
  Kitchen,
  Microwave,
  Window,
  LocalLaundryService,
  BorderBottom,
  Toys,
  Blinds,
  FormatPaint,
  AccessTime,
  HomeWork
};

const cityCode = 'MCO';
const tenantID = 1;

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

const steps = [
  'Contact Info',
  'Type of Cleaning',
  'Property Details',
  'Frequency',
  'Extras',
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
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    serviceCatalogIds: [],
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
    zipcode: '',
    city: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    specialInstructions: '',
    isRecurring: false,
    recurringPattern: null,
    customerName: '',
    contactInfo: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showRegister, setShowRegister] = useState(false);
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [booking, setBooking] = useState(false);
  const [serviceCatalog, setServiceCatalog] = useState([]);
  const [quotationId, setQuotationId] = useState(null);
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        console.log('Fetching service catalog...');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/service-catalog?cityCode=${cityCode}&tenantID=${tenantID}`);
        if (!res.ok) {
          const text = await res.text();
          console.error('API error:', text);
          return;
        }
        const data = await res.json();
        console.log('Service catalog data:', data);
        setServiceCatalog(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }
    fetchServices();
  }, []);

  // Split main and extra services
  const mainServices = serviceCatalog.filter(s => s.type === 'main');
  const extraServices = serviceCatalog.filter(s => s.type === 'extra');

  const isPoolCleaning = Array.isArray(formData.serviceCatalogIds) ? formData.serviceCatalogIds.includes('POOL_CLEANING') : formData.serviceCatalogIds === 'POOL_CLEANING';
  const isExteriorCleaning = Array.isArray(formData.serviceCatalogIds) ? formData.serviceCatalogIds.includes('EXTERIOR_CLEANING') : formData.serviceCatalogIds === 'EXTERIOR_CLEANING';

  // Step navigation
  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate only customerName, zipcode, and contactInfo
      if (!formData.customerName || !formData.zipcode || !formData.contactInfo) {
        setValidationErrors({
          customerName: !formData.customerName ? 'Name is required' : undefined,
          zipcode: !formData.zipcode ? 'Zipcode is required' : undefined,
          contactInfo: !formData.contactInfo ? 'Contact info is required' : undefined,
        });
        return;
      }
      // Determine if contactInfo is phone or email
      const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.contactInfo);
      const isPhone = /^\+?\d{7,}$/.test(formData.contactInfo.replace(/\D/g, ''));
      let customerPhone = '';
      let customerEmail = '';
      if (isEmail) customerEmail = formData.contactInfo;
      else if (isPhone) customerPhone = formData.contactInfo;
      else {
        setValidationErrors({ contactInfo: 'Please enter a valid phone number or email address.' });
        return;
      }
      // POST to create quotation
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quotations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: formData.customerName,
            zipcode: formData.zipcode,
            customerPhone,
            customerEmail,
          })
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to create quotation');
          return;
        }
        setQuotationId(data.quotation.id);
        setActiveStep((prev) => prev + 1);
      } catch (err) {
        setError('Failed to create quotation');
      }
    } else if (quotationId) {
      // PATCH to update quotation
      const fieldsToUpdate = { ...formData };
      // Remove fields that were already sent in step 1
      delete fieldsToUpdate.customerName;
      delete fieldsToUpdate.zipcode;
      delete fieldsToUpdate.contactInfo;
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/api/quotations/${quotationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fieldsToUpdate)
        });
        setActiveStep((prev) => prev + 1);
      } catch (err) {
        setError('Failed to update quotation');
      }
    } else {
      setError('Quotation ID missing. Please start from the beginning.');
    }
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Step 1: Card selection
  const handleServiceTypeSelect = (id) => {
    setFormData((prev) => {
      const selected = prev.serviceCatalogIds.includes(id)
        ? prev.serviceCatalogIds.filter((v) => v !== id)
        : [...prev.serviceCatalogIds, id];
      return { ...prev, serviceCatalogIds: selected };
    });
  };

  // Step 2: Property details change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        {mainServices.map(service => {
          const Icon = iconMap[service.icon] || CleaningServices;
          return (
            <Grid item xs={6} sm={3} key={service.id}>
              <Card
                variant={formData.serviceCatalogIds.includes(service.id) ? 'outlined' : 'elevation'}
                sx={{ border: formData.serviceCatalogIds.includes(service.id) ? '2px solid #1976d2' : undefined }}
                onClick={() => handleServiceTypeSelect(service.id)}
              >
                <CardActionArea>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Icon fontSize="large" />
                    <Typography>{service.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
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
        {extraServices.map(service => {
          const Icon = iconMap[service.icon] || CleaningServices;
          return (
            <Grid item xs={6} sm={4} key={service.id}>
              <Card
                variant={formData.extras.includes(service.id) ? 'outlined' : 'elevation'}
                sx={{ border: formData.extras.includes(service.id) ? '2px solid #1976d2' : undefined }}
                onClick={() => handleExtrasSelect(service.id)}
              >
                <CardActionArea>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Icon fontSize="large" />
                    <Typography>{service.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  // Step 5: Preferred Date & Time (previously Step 6)
  const renderStep5 = () => (
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

  // Step 6: Address & Contact Info (previously Step 5)
  const renderStep6 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Let's get started! Tell us how to contact you:</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Your Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Zipcode"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone or Email"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Enter your phone number or email address"
          />
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
      <Typography variant="h6" gutterBottom>Where should we send your cleaning team?</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={8}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
      </Grid>
      <EditableInvoiceQuoteCard
        formData={formData}
        getEstimate={getEstimate}
        editable={true}
        onEditSection={handleEditSection}
        serviceCatalog={serviceCatalog}
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

    // Get the final estimate
    const estimate = getEstimate();
    if (!estimate) {
      setError('Unable to calculate final price');
      return;
    }

    // Prepare the data to send
    const dataToSend = {
      ...formData,
      ...(isPoolCleaning && {
        bedrooms: undefined,
        bathrooms: undefined,
        squareFootage: undefined
      }),
      ...(user ? {} : { customerName: formData.customerName, customerEmail: formData.customerEmail, customerPhone: formData.customerPhone }),
      price: estimate.total // Include the final price
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
        serviceCatalogIds: [],
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
        zipcode: '',
        city: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        specialInstructions: '',
        isRecurring: false,
        recurringPattern: null,
        customerName: '',
        contactInfo: '',
      });
      // If guest, show registration prompt
      if (!user) setShowRegister(true);
    } catch (err) {
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
          name: formData.customerName,
          email: formData.customerEmail,
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
    const { serviceCatalogIds, bedrooms, bathrooms, squareFootage, poolSize, exteriorFlooringSize, yardSize, extras } = formData;
    if (!serviceCatalogIds || serviceCatalogIds.length === 0) return null;
    let estimate = 0;
    const parseSqft = (val) => {
      if (!val) return 0;
      if (val.includes('-')) {
        const [min, max] = val.split('-').map(Number);
        return Math.round((min + max) / 2);
      }
      if (val.startsWith('<')) return Number(val.replace('<', ''));
      if (val.endsWith('+')) return Number(val.replace('+', ''));
      return Number(val);
    };
    (Array.isArray(serviceCatalogIds) ? serviceCatalogIds : [serviceCatalogIds]).forEach(id => {
      const service = serviceCatalog.find(s => s.id === id);
      if (!service) return;
      switch (service.priceModel) {
        case 'per_hour':
          estimate += service.rate * Math.max(2, (Number(bedrooms) || 1) + (Number(bathrooms) || 1));
          break;
        case 'per_sqft':
          estimate += service.rate * parseSqft(squareFootage);
          break;
        case 'per_visit':
          estimate += service.rate;
          break;
        case 'per_load':
          estimate += service.rate * (formData.loads ? Number(formData.loads) : 1);
          break;
        case 'flat':
          estimate += service.rate;
          break;
        default:
          estimate += service.rate;
          break;
      }
    });
    (Array.isArray(extras) ? extras : [extras]).forEach(id => {
      const extra = serviceCatalog.find(s => s.id === id);
      if (!extra) return;
      switch (extra.priceModel) {
        case 'per_hour':
          estimate += extra.rate * 1;
          break;
        case 'per_sqft':
          estimate += extra.rate * parseSqft(squareFootage);
          break;
        case 'per_unit':
          estimate += extra.rate * 1;
          break;
        case 'per_load':
          estimate += extra.rate * (formData.loads ? Number(formData.loads) : 1);
          break;
        case 'per_room':
          estimate += extra.rate * (Number(bedrooms) || 1);
          break;
        case 'flat':
          estimate += extra.rate;
          break;
        default:
          estimate += extra.rate;
          break;
      }
    });
    return estimate > 0 ? estimate.toFixed(2) : null;
  };

  // Helper to determine if square footage should be shown
  const needsSquareFootage = () => {
    const types = Array.isArray(formData.serviceCatalogIds) ? formData.serviceCatalogIds : [formData.serviceCatalogIds];
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
    const types = Array.isArray(formData.serviceCatalogIds) ? formData.serviceCatalogIds : [formData.serviceCatalogIds];
    return types.some(type => [
      'GENERAL_CLEANING',
      'DEEP_CLEANING',
      'MOVE_IN_OUT',
      'POST_CONSTRUCTION'
    ].includes(type));
  };

  // Add new function to create quotation
  const createQuotation = async () => {
    try {
      // Get the current estimate
      const estimate = getEstimate();
      if (!estimate) {
        setError('Unable to calculate price');
        return null;
      }

      const dataToSend = {
        ...formData,
        ...(isPoolCleaning && {
          bedrooms: undefined,
          bathrooms: undefined,
          squareFootage: undefined
        }),
        ...(user ? {} : { customerName: formData.customerName, customerEmail: formData.customerEmail, customerPhone: formData.customerPhone }),
        price: estimate.total
      };

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
        throw new Error(data.error || 'Failed to create quotation');
      }

      return data.quotation;
    } catch (err) {
      setError('Failed to create quotation');
      return null;
    }
  };

  // Update handleBook to use existing quotation
  const handleBook = async () => {
    setBooking(true);
    setError(null);
    if (!formData.address || !formData.city) {
      setError('Address and city are required.');
      setBooking(false);
      return;
    }
    try {
      const price = getEstimate();
      // PATCH update with all collected formData fields and price
      await fetch(`${process.env.REACT_APP_API_URL}/api/quotations/${quotationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price })
      });
      // For cash payment, show modal
      if (paymentMethod === 'cash') {
        setShowSuccessModal(true);
        setBooking(false);
      }
      // For card payment, the success will be handled by the StripePaymentForm
    } catch (err) {
      setError('Failed to process booking');
      setBooking(false);
    }
  };

  const handleExtrasSelect = (id) => {
    setFormData(prev => {
      const selected = prev.extras.includes(id)
        ? prev.extras.filter(e => e !== id)
        : [...prev.extras, id];
      return { ...prev, extras: selected };
    });
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
              {activeStep === 0 && renderStep6()}
              {activeStep === 1 && renderStep1()}
              {activeStep === 2 && renderStep2()}
              {activeStep === 3 && renderStep3()}
              {activeStep === 4 && renderStep4()}
              {activeStep === 5 && renderStep5()}
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
                      (activeStep === 0 && (
                        !formData.customerName ||
                        !formData.zipcode ||
                        !formData.contactInfo ||
                        validationErrors.customerName ||
                        validationErrors.zipcode ||
                        validationErrors.contactInfo
                      )) ||
                      (activeStep === 1 && formData.serviceCatalogIds.length === 0) ||
                      (activeStep === 2 && !formData.propertyType) ||
                      (activeStep === 3 && !formData.frequency) ||
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
                          label="Customer Name"
                          value={formData.customerName}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Customer Email"
                          value={formData.customerEmail}
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
              <QuoteSummaryCard formData={formData} getEstimate={getEstimate} serviceCatalog={serviceCatalog} />
            )}
          </Grid>
        </Grid>
      </Box>
      <Dialog open={showSuccessModal} onClose={() => { setShowSuccessModal(false); navigate('/'); }}>
        <DialogTitle>Booking created!</DialogTitle>
        <DialogContent>
          <Typography>Booking created! We will contact you soon.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowSuccessModal(false); navigate('/'); }} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuotationRequest; 