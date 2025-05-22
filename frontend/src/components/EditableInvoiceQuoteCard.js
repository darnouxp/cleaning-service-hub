import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, Divider, IconButton, Tooltip, Table, TableBody, TableCell, TableRow, TableContainer, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import RepeatIcon from '@mui/icons-material/Repeat';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventIcon from '@mui/icons-material/Event';

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

const EditableInvoiceQuoteCard = ({ formData, getEstimate, editable = false, onEditSection }) => {
  const [displayedTotal, setDisplayedTotal] = useState(0);
  const subtotal = Number(getEstimate() || 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  useEffect(() => { setDisplayedTotal(total); }, [total]);
  const today = new Date();
  const dateStr = today.toLocaleDateString();
  // Company Info
  const company = {
    name: 'Prime Shine',
    phone: '(786) 274-8284',
    address: '725 NE 166th St',
    city: 'Miami, Florida(FL), 33162',
  };
  return (
    <Card elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, maxWidth: 500, mx: 'auto', my: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.main">{company.name}</Typography>
          <Typography variant="body2">{company.phone}</Typography>
          <Typography variant="body2">{company.address}</Typography>
          <Typography variant="body2">{company.city}</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h6" fontWeight={700} color="text.secondary">QUOTE</Typography>
          <Typography variant="body2" color="text.secondary">Date: {dateStr}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {/* Details Table */}
      <TableContainer component={Paper} elevation={0} sx={{ mb: 2, background: 'none' }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0, fontWeight: 600 }}>
                <ListAltIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> Cleaning Type(s)
                {editable && <Tooltip title="Edit"><IconButton size="small" onClick={() => onEditSection?.(0)}><EditIcon fontSize="small" /></IconButton></Tooltip>}
              </TableCell>
              <TableCell sx={{ border: 0 }}>{formData.serviceType.map(val => cleaningTypes.find(t => t.value === val)?.label).join(', ') || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0, fontWeight: 600 }}>
                <HomeWorkIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> Property
                {editable && <Tooltip title="Edit"><IconButton size="small" onClick={() => onEditSection?.(1)}><EditIcon fontSize="small" /></IconButton></Tooltip>}
              </TableCell>
              <TableCell sx={{ border: 0 }}>{propertyTypes.find(t => t.value === formData.propertyType)?.label}{formData.squareFootage && `, ${squareFootageOptions.find(o => o.value === formData.squareFootage)?.label}`}{formData.bedrooms && `, ${formData.bedrooms} bed`}{formData.bathrooms && `, ${formData.bathrooms} bath`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0, fontWeight: 600 }}>
                <RepeatIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> Frequency
                {editable && <Tooltip title="Edit"><IconButton size="small" onClick={() => onEditSection?.(2)}><EditIcon fontSize="small" /></IconButton></Tooltip>}
              </TableCell>
              <TableCell sx={{ border: 0 }}>{frequencyOptions.find(f => f.value === formData.frequency)?.label || '-'}</TableCell>
            </TableRow>
            {formData.extras && formData.extras.length > 0 && (
              <TableRow>
                <TableCell sx={{ border: 0, pl: 0, fontWeight: 600 }}>
                  <AddCircleOutlineIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> Extras
                  {editable && <Tooltip title="Edit"><IconButton size="small" onClick={() => onEditSection?.(3)}><EditIcon fontSize="small" /></IconButton></Tooltip>}
                </TableCell>
                <TableCell sx={{ border: 0 }}>{formData.extras.join(', ')}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0, fontWeight: 600 }}>
                <EventIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> Date & Time
                {editable && <Tooltip title="Edit"><IconButton size="small" onClick={() => onEditSection?.(5)}><EditIcon fontSize="small" /></IconButton></Tooltip>}
              </TableCell>
              <TableCell sx={{ border: 0 }}>{formData.preferredDate || '-'} {formData.preferredTime && `(${formData.preferredTime})`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ mb: 2 }} />
      {/* Totals */}
      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="body2" color="text.secondary">Subtotal</Typography>
          <Typography sx={priceFont}>${subtotal.toFixed(2)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="body2" color="text.secondary">VAT (7%)</Typography>
          <Typography sx={priceFont}>${vat.toFixed(2)}</Typography>
        </Box>
        <Divider sx={{ my: 1, width: '100%' }} />
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="subtitle1" fontWeight={700} color="primary" letterSpacing={0.5}>Total</Typography>
          <Typography sx={{ ...priceFont, color: 'primary.main', fontWeight: 700, fontSize: '1.3rem' }}>${displayedTotal.toFixed(2)}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default EditableInvoiceQuoteCard; 