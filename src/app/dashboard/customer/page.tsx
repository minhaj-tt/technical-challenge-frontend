/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import {
  Grid,
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const CustomerDashboard = () => {
  //   const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check for authentication and customer role
  //   useEffect(() => {
  //     if (!isAuthenticated || user.role !== "customer") {
  //       router.push("/login"); // Redirect to login if not authenticated or not a customer
  //     }
  //   }, [isAuthenticated, user, router]);

  // Fetch customer orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/customers/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  };

  // Clear error and success messages
  const handleCloseSnackbar = () => {
    setError("");
    setSuccessMessage("");
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customer Dashboard
      </Typography>

      {/* Display success or error message */}
      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Grid container spacing={3}>
        {/* Display customer orders */}
        <Grid item xs={12}>
          <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Orders
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2}>
                {orders.length === 0 ? (
                  <Typography>
                    No orders found. Please make a purchase.
                  </Typography>
                ) : (
                  <List>
                    {orders.map((order) => (
                      <ListItem key={order.id}>
                        <ListItemText
                          primary={`Order ID: ${order.id}`}
                          secondary={`Status: ${order.status} - Total: $${order.total}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard;
