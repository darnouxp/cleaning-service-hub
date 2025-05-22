import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Dashboard = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/quotations/admin/pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setQuotes(data);
      } catch (err) {
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'guestName', headerName: 'Customer Name', width: 180 },
    { field: 'guestEmail', headerName: 'Email', width: 220 },
    { field: 'serviceType', headerName: 'Services', width: 200, valueGetter: (params) => (Array.isArray(params.row.serviceType) ? params.row.serviceType.join(', ') : params.row.serviceType) },
    { field: 'propertyType', headerName: 'Property Type', width: 140 },
    { field: 'createdAt', headerName: 'Requested At', width: 180, valueGetter: (params) => new Date(params.row.createdAt).toLocaleString() },
    { field: 'status', headerName: 'Status', width: 120 }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Pending Quote Requests
          </Typography>
          <DataGrid
            rows={quotes}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            autoHeight={false}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 