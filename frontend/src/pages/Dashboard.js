import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Tabs, Tab, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Dashboard = () => {
  const [quotes, setQuotes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quotations/admin/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch quotes');
        }
        const data = await res.json();
        setQuotes(data);
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError('Failed to fetch quotes');
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await res.json();
        // Filter for active bookings (CONFIRMED or IN_PROGRESS)
        const activeBookings = data.filter(booking => 
          ['CONFIRMED', 'IN_PROGRESS'].includes(booking.status)
        );
        setBookings(activeBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch bookings');
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchQuotes();
    fetchBookings();
    fetchUsers();
  }, []);

  const quoteColumns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'customerName', headerName: 'Customer Name', width: 180 },
    { field: 'customerEmail', headerName: 'Email', width: 220 },
    { field: 'customerPhone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'zipcode', headerName: 'Zipcode', width: 100 },
    { field: 'city', headerName: 'City', width: 150 },
    {
      field: 'serviceCatalogIds',
      headerName: 'Services',
      width: 200,
      valueGetter: (params) => {
        const catalog = params.serviceCatalog || [];
        const ids = params.row.serviceCatalogIds || [];
        return ids.map(id => catalog.find(s => s.id === id)?.name).filter(Boolean).join(', ');
      }
    },
    { field: 'propertyType', headerName: 'Property Type', width: 140 },
    { field: 'createdAt', headerName: 'Requested At', width: 180, valueGetter: (params) => new Date(params.row.createdAt).toLocaleString() },
    { field: 'status', headerName: 'Status', width: 120 }
  ];

  const bookingColumns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'startTime', headerName: 'Start Time', width: 180, valueGetter: (params) => new Date(params.row.startTime).toLocaleString() },
    { field: 'endTime', headerName: 'End Time', width: 180, valueGetter: (params) => new Date(params.row.endTime).toLocaleString() },
    { field: 'duration', headerName: 'Duration (min)', width: 120 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 120, valueGetter: (params) => `$${params.row.totalAmount}` },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'specialInstructions', headerName: 'Special Instructions', width: 200 }
  ];

  const userColumns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'phoneNumber', headerName: 'Phone', width: 150 },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'isActive', headerName: 'Active', width: 100, type: 'boolean' },
    { field: 'createdAt', headerName: 'Created At', width: 180, valueGetter: (params) => new Date(params.row.createdAt).toLocaleString() }
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Pending Quotes" />
          <Tab label="Active Bookings" />
          <Tab label="Users" />
        </Tabs>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          {currentTab === 0 && (
            <DataGrid
              rows={quotes}
              columns={quoteColumns}
              getRowId={(row) => row.id}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          )}
          {currentTab === 1 && (
            <DataGrid
              rows={bookings}
              columns={bookingColumns}
              getRowId={(row) => row.id}
              loading={loadingBookings}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          )}
          {currentTab === 2 && (
            <DataGrid
              rows={users}
              columns={userColumns}
              getRowId={(row) => row.id}
              loading={loadingUsers}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 