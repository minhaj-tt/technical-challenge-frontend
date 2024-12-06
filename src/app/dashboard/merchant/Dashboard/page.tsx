import { useState, useEffect } from "react";
// import { useAuth } from "../../context/authContext";
import { useRouter } from "next/router";
import {
  Grid,
  Container,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import axios from "axios";

const MerchantDashboard = () => {
  //  const { user, isAuthenticated } = {"user", true}};
  // const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [newStoreName, setNewStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check for authentication and merchant role
  // useEffect(() => {
  //   if (!isAuthenticated || user.role !== "merchant") {
  //     router.push("/login"); // Redirect to login if not authenticated or not a merchant
  //   }
  // }, [isAuthenticated, user, router]);

  // Fetch stores for the merchant
  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/merchants/stores`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStores(response.data.stores);
      setLoading(false);
    } catch (err) {
      setError("Failed to load stores. Please try again.");
      setLoading(false);
    }
  };

  // Handle adding a new store
  const handleAddStore = async () => {
    if (!newStoreName) {
      setError("Store name is required.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/merchants/stores",
        { name: newStoreName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStores((prevStores) => [...prevStores, response.data.store]);
      setNewStoreName(""); // Reset store name field
      setSuccessMessage("Store added successfully!");
      setLoading(false);
    } catch (err) {
      setError("Failed to add store. Please try again.");
      setLoading(false);
    }
  };

  // Clear error and success messages
  const handleCloseSnackbar = () => {
    setError("");
    setSuccessMessage("");
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Merchant Dashboard
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
        {/* Add new store section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add New Store
            </Typography>
            <TextField
              fullWidth
              label="Store Name"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              variant="outlined"
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddStore}
                startIcon={<AddCircle />}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add Store"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Display list of stores */}
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Stores
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2}>
                {stores.length === 0 ? (
                  <Typography>No stores found. Please add a store.</Typography>
                ) : (
                  stores.map((store) => (
                    <Grid item xs={12} sm={6} key={store.id}>
                      <Box
                        sx={{
                          padding: 2,
                          border: "1px solid #ddd",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body1">{store.name}</Typography>
                      </Box>
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MerchantDashboard;
