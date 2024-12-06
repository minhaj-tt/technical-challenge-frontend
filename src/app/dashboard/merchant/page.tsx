/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Container,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { AddCircle, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";


const MerchantDashboard = () => {
  const router = useRouter()
  const [stores, setStores] = useState<any[]>([]);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreDescription, setNewStoreDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [storeToEdit, setStoreToEdit] = useState<any>(null);
  const [editStoreName, setEditStoreName] = useState("");
  const [editStoreDescription, setEditStoreDescription] = useState("");

  const fetchStores = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/stores`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const merchantId = userData?.id;

      const filteredStores = response.data.stores.filter(
        (store: any) => store.merchant_id === merchantId
      );

      setStores(filteredStores);
    } catch (err) {
      setError("Error fetching stores. Please try again.");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleAddStore = async () => {
    if (!newStoreName || !newStoreDescription) {
      setError("Both store name and description are required.");
      return;
    }

    try {
      setLoading(true);

      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const merchantId = userData?.id;

      const newStore = {
        name: newStoreName,
        description: newStoreDescription,
        merchantId: merchantId,
        active: true,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/stores`,
        newStore,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNewStoreName("");
      setNewStoreDescription("");
      await fetchStores();
      setSuccessMessage("Store added successfully!");
      setLoading(false);
    } catch (err) {
      setError("Failed to add store. Please try again.");
      setLoading(false);
    }
  };

  const handleOpenEditModal = (store: any) => {
    setStoreToEdit(store);
    setEditStoreName(store.name);
    setEditStoreDescription(store.description);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setStoreToEdit(null);
    setEditStoreName("");
    setEditStoreDescription("");
  };

  const handleEditStore = async () => {
    if (!editStoreName || !editStoreDescription) {
      setError("Both store name and description are required.");
      return;
    }

    try {
      setLoading(true);

      const updatedStore = {
        name: editStoreName,
        description: editStoreDescription,
        active: true,
      };

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/stores/${storeToEdit.id}`,
        updatedStore,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchStores();
      setSuccessMessage("Store updated successfully!");
      setLoading(false);
      handleCloseEditModal();
    } catch (err) {
      setError("Failed to update store. Please try again.");
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign={'center'}
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Merchant Dashboard
      </Typography>

      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: 3,
              border: "1px solid #ccc",
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Add New Store
            </Typography>
            <TextField
              fullWidth
              label="Store Name"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Store Description"
              value={newStoreDescription}
              onChange={(e) => setNewStoreDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddStore}
                startIcon={<AddCircle />}
                disabled={loading}
                sx={{
                  textTransform: "capitalize",
                  padding: "10px 20px",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
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

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: 3,
              border: "1px solid #ccc",
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Your Stores
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2}>
                {stores?.length === 0 ? (
                  <Typography>No stores found. Please add a store.</Typography>
                ) : (
                  stores?.map((store) => (
                    <Grid item xs={12} sm={6} key={store.id}>
                      <Card
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: 3,
                          borderRadius: 2,
                          padding: 2,
                          backgroundColor: "#ffffff",
                          transition: "transform 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-5px)",
                          },
                        }}
                      >
                        <Avatar
                          alt={store.name}
                          src="https://via.placeholder.com/60"
                          sx={{
                            width: 60,
                            height: 60,
                            margin: "0 auto",
                            marginBottom: 2,
                          }}
                        />
                        <CardContent>
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{ fontWeight: "bold", color: "#333" }}
                          >
                            {store.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {store.description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <IconButton
                            aria-label="edit"
                            sx={{
                              backgroundColor: "#1976d2",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#1565c0",
                              },
                            }}
                            onClick={() => handleOpenEditModal(store)}
                          >
                            <Edit />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>

      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              width: 400,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Edit Store
            </Typography>
            <TextField
              fullWidth
              label="Store Name"
              value={editStoreName}
              onChange={(e) => setEditStoreName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Store Description"
              value={editStoreDescription}
              onChange={(e) => setEditStoreDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditStore}
                disabled={loading}
                sx={{
                  textTransform: "capitalize",
                  padding: "10px 20px",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Store"
                )}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseEditModal}
                sx={{
                  textTransform: "capitalize",
                  marginLeft: 2,
                  padding: "10px 20px",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{
            width: '250px',
            textTransform: "capitalize",
            padding: "10px 20px",
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#c62828",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default MerchantDashboard;
