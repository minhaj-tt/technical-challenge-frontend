/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import PrimaryCard from "../../../components/PrimaryCard";

const AdminDashboard = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [stores, setStores] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "merchants">("users");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const storesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/stores`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(usersResponse.data.users);
      setStores(storesResponse.data.stores);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccessMessage("");
  };

  return (
    <Box>
      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Stack direction="row" height="100vh">
        {/* Static Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "20%" },
            height: "100vh", // Fixed height
            position: "fixed", // Makes it static
            top: 0,
            left: 0,
            borderRadius: 2,
            p: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflow: "hidden", // Prevent scrolling
            backgroundColor: "white", // Ensures visibility
          }}
        >
          <Button
            variant={activeTab === "users" ? "contained" : "outlined"}
            color="primary"
            fullWidth
            onClick={() => setActiveTab("users")}
            sx={{
              fontWeight: "bold",
              py: 1.5,
              textTransform: "capitalize",
              boxShadow: activeTab === "users" ? 3 : 1,
            }}
          >
            Manage Users
          </Button>
          <Button
            variant={activeTab === "merchants" ? "contained" : "outlined"}
            color="primary"
            fullWidth
            onClick={() => setActiveTab("merchants")}
            sx={{
              fontWeight: "bold",
              py: 1.5,
              textTransform: "capitalize",
              boxShadow: activeTab === "merchants" ? 3 : 1,
            }}
          >
            Manage Merchants Stores
          </Button>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            width: { xs: "100%", md: "80%" },
            ml: { md: "25%" }, // Adjusts for the sidebar
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack direction="row" flexWrap="wrap">
              {activeTab === "users" &&
                users.map((user, index) => (
                  <Box key={index}>
                    <PrimaryCard
                      id={user.id}
                      first_name={user.first_name}
                      last_name={user.last_name}
                      role={user.role} description={undefined} />

                  </Box>
                ))}
              {activeTab === "merchants" &&
                stores.map((store, index) => (
                  <Box
                    key={index}
                  >
                    <PrimaryCard
                      id={store.id}
                      last_name={undefined}
                      first_name={store.name}
                      description={store.description}
                      role={undefined}
                    />
                  </Box>
                ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>

  );
};

export default AdminDashboard;
