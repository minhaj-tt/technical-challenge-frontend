/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DummyAvatar from "../app/assets/images/images.jpeg";

export default function StylishCard({ id, first_name, last_name, role, description }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: first_name || "",
    lastName: last_name || "",
    role: role || "",
    storeDescription: description || "",
    storeName: first_name || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = role !== undefined
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stores/${id}`;

      const payload = role !== undefined
        ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        }
        : {
          name: formData.storeName, // Changed to storeName for store
          description: formData.storeDescription,
        };

      const response = await axios.patch(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(role !== undefined ? "User updated successfully" : "Store updated successfully", response.data);
      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred while updating details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: 2,
        ml: 1,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: 350,
          borderRadius: 4,
          boxShadow: 10,
          backgroundColor: "#ffffff",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
          },
          textAlign: "center",
          padding: 3,
        }}
      >
        <Avatar
          alt={`${first_name} ${last_name}`}
          src={DummyAvatar}
          sx={{
            width: 80,
            height: 80,
            margin: "0 auto",
            marginBottom: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        />
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#333",
              textTransform: "capitalize",
              marginBottom: 1,
            }}
          >
            {first_name} {last_name}
          </Typography>
          {role !== undefined && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: 14,
                fontStyle: "italic",
                marginBottom: 1,
              }}
            >
              {role ? `Role: ${role}` : "Role: N/A"}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {description
              ? description
              : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tristique volutpat sapien, ut ullamcorper enim bibendum a."}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: "center",
            marginTop: 2,
            gap: 1,
          }}
        >
          <IconButton
            size="large"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            aria-label="edit"
            onClick={handleOpen}
          >
            <EditIcon />
          </IconButton>
        </CardActions>
      </Card>

      {/* Edit Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-details-modal"
        aria-describedby="modal-to-edit-details"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {role !== undefined ? "Edit User Details" : "Edit Store Details"}
          </Typography>
          {role !== undefined ? (
            <>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          ) : (
            <>
              <TextField
                label="Store Name"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Submit"}
            </Button>
            <Button variant="outlined" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
