import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import QuotationRequest from '../components/QuotationRequest';

const Quotations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [error, setError] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showQuotationDialog, setShowQuotationDialog] = useState(false);
  const [showMaidSelection, setShowMaidSelection] = useState(false);
  const [serviceCatalog, setServiceCatalog] = useState([]);

  useEffect(() => {
    if (user) {
      fetchQuotations();
      fetchServiceCatalog();
    }
  }, [user]);

  const fetchQuotations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quotations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch quotations');
      }
      setQuotations(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchServiceCatalog = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/service-catalog`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch service catalog');
      }
      setServiceCatalog(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewQuotation = (quotation) => {
    if (!user) {
      navigate('/login', { state: { from: '/quotations' } });
      return;
    }
    setSelectedQuotation(quotation);
    setShowQuotationDialog(true);
  };

  const handleAcceptQuotation = async (maidId) => {
    if (!user) {
      navigate('/login', { state: { from: '/quotations' } });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/quotations/${selectedQuotation.id}/accept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ maidId })
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept quotation');
      }

      setShowMaidSelection(false);
      setShowQuotationDialog(false);
      fetchQuotations();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRejectQuotation = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/quotations' } });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/quotations/${selectedQuotation.id}/reject`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject quotation');
      }

      setShowQuotationDialog(false);
      fetchQuotations();
    } catch (error) {
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'EXPIRED':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Get a Cleaning Quote
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <QuotationRequest onSuccess={user ? fetchQuotations : () => {}} />
        </Grid>

        {user && quotations.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Your Quotes
            </Typography>
            <Grid container spacing={2}>
              {quotations.map((quotation) => (
                <Grid item xs={12} md={6} key={quotation.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">
                          {(quotation.serviceCatalogIds || []).map(id => (serviceCatalog.find(s => s.id === id)?.name)).filter(Boolean).join(', ')}
                        </Typography>
                        <Chip
                          label={quotation.status}
                          color={getStatusColor(quotation.status)}
                          size="small"
                        />
                      </Box>
                      <Typography color="textSecondary" gutterBottom>
                        {quotation.propertyType} • {quotation.bedrooms} beds • {quotation.bathrooms} baths
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Square Footage: {quotation.squareFootage} sq ft
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Estimated Duration: {formatDuration(quotation.estimatedDuration)}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ${quotation.estimatedPrice}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleViewQuotation(quotation)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {!user && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(90deg, #f3e7e9 0%, #e3eeff 100%)' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Experience hassle-free cleaning with trusted professionals
              </Typography>
              <Typography variant="body1" paragraph>
                Get your instant quote and see why so many choose 5 Fairies Cleaning Services for their home and office cleaning needs. Enjoy top-rated service, transparent pricing, and satisfaction guaranteed!
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Quotation Details Dialog */}
      <Dialog
        open={showQuotationDialog}
        onClose={() => setShowQuotationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedQuotation && (
          <>
            <DialogTitle>
              Quotation Details
              <Chip
                label={selectedQuotation.status}
                color={getStatusColor(selectedQuotation.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Service Details
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Type: {(selectedQuotation.serviceCatalogIds || []).map(id => (serviceCatalog.find(s => s.id === id)?.name)).filter(Boolean).join(', ')}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Property: {selectedQuotation.propertyType}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Bedrooms: {selectedQuotation.bedrooms}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Bathrooms: {selectedQuotation.bathrooms}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Square Footage: {selectedQuotation.squareFootage} sq ft
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Pricing
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Estimated Duration: {formatDuration(selectedQuotation.estimatedDuration)}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${selectedQuotation.estimatedPrice}
                  </Typography>
                </Grid>
                {selectedQuotation.specialRequirements && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Special Requirements
                    </Typography>
                    <Typography variant="body2">
                      {selectedQuotation.specialRequirements}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {selectedQuotation.status === 'PENDING' && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowMaidSelection(true)}
                    sx={{ mr: 1 }}
                  >
                    Accept Quote
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRejectQuotation}
                  >
                    Reject Quote
                  </Button>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowQuotationDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Maid Selection Dialog */}
      <Dialog
        open={showMaidSelection}
        onClose={() => setShowMaidSelection(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select a Cleaning Professional</DialogTitle>
        <DialogContent>
          <List>
            {selectedQuotation?.availableMaids?.map((maid) => (
              <React.Fragment key={maid.id}>
                <ListItem button onClick={() => handleAcceptQuotation(maid.id)}>
                  <ListItemAvatar>
                    <Avatar>{maid.firstName[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${maid.firstName} ${maid.lastName}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          Rating: {maid.rating.toFixed(1)} ({maid.totalReviews} reviews)
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textPrimary">
                          Hourly Rate: ${maid.hourlyRate}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMaidSelection(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Quotations; 