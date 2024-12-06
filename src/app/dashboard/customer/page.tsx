/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Box, Avatar, CircularProgress, Button, IconButton, Modal, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

const CustomerDashboard = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState<any>({
    first_name: "",
    last_name: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setUserInfo(response.data.user);
        setUpdatedUserInfo({
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user details. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserInfo({ ...updatedUserInfo, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        updatedUserInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUserInfo(response.data.user);
      setOpenModal(false);
    } catch (err) {
      setError("Failed to update user details. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Loading user details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Avatar
          alt={userInfo?.first_name || "User Avatar"}
          src="/avatar.png"
          sx={{
            width: 120,
            height: 120,
            mb: 3,
            border: "4px solid #2196f3",
          }}
        />
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#333", mb: 1 }}>
          {userInfo?.first_name || "Unknown"} {userInfo?.last_name || "Unknown"}
          <IconButton
            onClick={handleOpenModal}
            sx={{
              color: "#2196f3",
              ml: 2,
              "&:hover": {
                color: "#1976d2",
              },
            }}
          >
            <EditIcon />
          </IconButton>
        </Typography>
        <Typography variant="body1" sx={{ color: "#555", mb: 2 }}>
          {userInfo?.email || "No Email Provided"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "white",
            backgroundColor: "#4caf50",
            borderRadius: "8px",
            padding: "4px 12px",
            display: "inline-block",
            fontWeight: "bold",
          }}
        >
          Role: {userInfo?.role || "No Role Assigned"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            color: "#666",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          With a proven track record in the computer software industry, I bring extensive expertise as a MERN Stack
          Developer. I am proficient in technologies such as React.js, React Native, Next.js, Node.js, and WordPress,
          enabling me to create robust and scalable web applications. My strong analytical skills and excellent
          communication abilities have been key in building successful client partnerships. Holding a Bachelor&apos;s degree
          in Computer Science from Lahore Garrison University, I continuously seek professional growth to stay ahead of
          industry trends. Dedicated to delivering top-notch results with maximum efficiency, I am a valuable asset to
          any collaborative team. Let&apos;s innovate and enhance the digital experience together.
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{
            mt: 4,
            backgroundColor: "#d32f2f",
            color: "#fff",
            fontWeight: "bold",
            padding: "12px 24px",
            width: "100%",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
            borderRadius: 2
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Edit Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            padding: 4,
            borderRadius: 3,
            boxShadow: 24,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: "#333", fontWeight: "bold" }}>
            Edit Profile
          </Typography>
          <TextField
            label="First Name"
            variant="outlined"
            name="first_name"
            value={updatedUserInfo.first_name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            name="last_name"
            value={updatedUserInfo.last_name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
              sx={{
                width: "48%",
                color: "#2196f3",
                borderColor: "#2196f3",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              sx={{
                width: "48%",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default CustomerDashboard;
