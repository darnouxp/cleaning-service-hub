import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, Divider, useTheme, Fade, IconButton, Tooltip } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import RepeatIcon from '@mui/icons-material/Repeat';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventIcon from '@mui/icons-material/Event';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditIcon from '@mui/icons-material/Edit';

const VAT_RATE = 0.07;

const cleaningTypes = [
  { value: 'GENERAL_CLEANING', label: 'General Cleaning' },
  { value: 'DEEP_CLEANING', label: 'Deep Cleaning' },
  { value: 'POST_CONSTRUCTION', label: 'Post-Construction' },
  { value: 'MOVE_IN_OUT', label: 'Move In/Out' },
  { value: 'OFFICE', label: 'Office/Commercial' },
  { value: 'POOL_CLEANING', label: 'Pool Cleaning' },
  { value: 'EXTERIOR_CLEANING', label: 'Exteriors Cleaning' },
];

const propertyTypes = [
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'OTHER', label: 'Other' },
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

const frequencyOptions = [
  { label: 'One-time', value: 'ONE_TIME' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Bi-weekly', value: 'BIWEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
];

const priceFont = {
  fontFamily: 'monospace',
  fontVariantNumeric: 'tabular-nums',
  fontSize: '1.1rem',
  letterSpacing: '0.01em',
};

const QuoteSummaryCard = ({ formData, getEstimate, editable = false, onEditSection }) => {
  const theme = useTheme();
  const [displayedTotal, setDisplayedTotal] = useState(0);
  const subtotal = Number(getEstimate() || 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  // Animate total update
  useEffect(() => {
    setDisplayedTotal(total);
  }, [total]);

  return (
    <Card
      elevation={6}
      sx={{
        mt: 4,
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        boxShadow: 6,
        maxWidth: { xs: '100%', md: 300 },
        width: { xs: '100%', md: 300 },
        mx: { xs: 0, md: 'auto' },
        position: { md: 'sticky' },
        top: { md: 32 },
        bgcolor: 'background.paper',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <ReceiptLongIcon color="primary" fontSize="medium" />
        <Typography variant="h6" fontWeight={700} letterSpacing={0.5}>
          Quote Summary
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box mb={2}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <ListAltIcon color="action" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={600} letterSpacing={0.2}>Cleaning Type(s):</Typography>
          {editable && (
            <Tooltip title="Edit Cleaning Type(s)"><IconButton size="small" onClick={() => onEditSection?.(0)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 3 }}>
          {formData.serviceType.map(val => cleaningTypes.find(t => t.value === val)?.label).join(', ') || '-'}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <HomeWorkIcon color="action" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={600} letterSpacing={0.2}>Property:</Typography>
          {editable && (
            <Tooltip title="Edit Property"><IconButton size="small" onClick={() => onEditSection?.(1)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 3 }}>
          {propertyTypes.find(t => t.value === formData.propertyType)?.label}
          {formData.squareFootage && `, ${squareFootageOptions.find(o => o.value === formData.squareFootage)?.label}`}
          {formData.bedrooms && `, ${formData.bedrooms} bed`}
          {formData.bathrooms && `, ${formData.bathrooms} bath`}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <RepeatIcon color="action" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={600} letterSpacing={0.2}>Frequency:</Typography>
          {editable && (
            <Tooltip title="Edit Frequency"><IconButton size="small" onClick={() => onEditSection?.(2)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 3 }}>
          {frequencyOptions.find(f => f.value === formData.frequency)?.label || '-'}
        </Typography>
        {formData.extras && formData.extras.length > 0 && (
          <>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <AddCircleOutlineIcon color="action" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={600} letterSpacing={0.2}>Extras:</Typography>
              {editable && (
                <Tooltip title="Edit Extras"><IconButton size="small" onClick={() => onEditSection?.(3)}><EditIcon fontSize="small" /></IconButton></Tooltip>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 3 }}>
              {formData.extras.join(', ')}
            </Typography>
          </>
        )}
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <EventIcon color="action" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={600} letterSpacing={0.2}>Date & Time:</Typography>
          {editable && (
            <Tooltip title="Edit Date & Time"><IconButton size="small" onClick={() => onEditSection?.(5)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 3 }}>
          {formData.preferredDate || '-'} {formData.preferredTime && `(${formData.preferredTime})`}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
        <Typography sx={priceFont}>${subtotal.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography variant="body2" color="text.secondary">VAT (7%)</Typography>
        <Typography sx={priceFont}>${vat.toFixed(2)}</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Fade in={true} key={displayedTotal} timeout={500}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="subtitle1" fontWeight={700} color="primary" letterSpacing={0.5}>
            Total
          </Typography>
          <Typography
            sx={{ ...priceFont, color: theme.palette.primary.main, fontWeight: 700, fontSize: '1.3rem' }}
            data-testid="quote-total"
          >
            ${displayedTotal.toFixed(2)}
          </Typography>
        </Box>
      </Fade>
    </Card>
  );
};

export default QuoteSummaryCard; 