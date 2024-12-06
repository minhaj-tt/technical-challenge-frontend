/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  IconButton,
  Modal,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DummyAvatar from "../app/assets/images/avatar.png";
import DummyShop from "../app/assets/images/shop.png";
import Image from "next/image";

interface StylishCardProps {
  id: string;
  first_name: string;
  last_name: string;
  role?: string;
  description?: string;
}

const StylishCard: React.FC<StylishCardProps> = ({
  id,
  first_name,
  last_name,
  role,
  description,
}) => {
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (role !== undefined) {
        const updatedUserData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        };

        setFormData({
          firstName: updatedUserData.firstName,
          lastName: updatedUserData.lastName,
          role: updatedUserData.role,
          storeDescription: formData.storeDescription,
          storeName: formData.storeName,
        });

        console.log("User updated locally", updatedUserData);
      } else {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stores/${id}`;
        const payload = {
          name: formData.storeName,
          description: formData.storeDescription,
        };

        const response = await axios.patch(apiUrl, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Store updated successfully", response.data);
      }

      handleClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "An error occurred while updating details."
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
          width: isMobile ? "100%" : 350,
          borderRadius: 4,
          boxShadow: 10,
          backgroundColor: "#f5f5f5",
          transition:
            "transform 0.3s ease-in-out, box-shadow 0.3s ease, background-color 0.3s ease",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#e3f2fd",
          },
          textAlign: "center",
          padding: 3,
          border: "1px solid #1976d2",
          background: "#f9f9f9",
        }}
      >
        <Image
          src={role !== undefined ? DummyAvatar : DummyShop}
          alt={`${first_name} ${last_name}`}
          width={isMobile ? 70 : 90}
          height={isMobile ? 70 : 90}
          style={{
            margin: "0 auto",
            marginBottom: "2px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            border: "3px solid #1976d2",
            backgroundColor: "#1976d2",
            borderRadius: "50%",
          }}
        />
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              textTransform: "capitalize",
              marginBottom: 1,
              letterSpacing: 1,
            }}
          >
            {first_name} {last_name}
          </Typography>
          {role && (
            <Typography
              variant="body2"
              sx={{
                color: "#1976d2",
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
              fontWeight: "light",
              textAlign: "center",
              marginTop: 1,
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
              borderRadius: "50%",
              padding: 1,
            }}
            aria-label="edit"
            onClick={handleOpen}
          >
            <EditIcon />
          </IconButton>
        </CardActions>
      </Card>

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
            width: isMobile ? "90%" : 400,
            border: "2px solid #1976d2",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, color: "#1976d2" }}
          >
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
                color="primary"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
                color="primary"
              />
              <TextField
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
                color="primary"
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
                color="primary"
              />
              <TextField
                label="Description"
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
                color="primary"
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
};

export default StylishCard;
