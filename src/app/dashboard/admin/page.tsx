/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import PrimaryCard from "../../../components/PrimaryCard";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Store {
  id: string;
  name: string;
  description: string;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"users" | "merchants">("users");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authorization token is missing.");
        setLoading(false);
        return;
      }

      const usersResponse = await axios.get<{ users: User[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const storesResponse = await axios.get<{ stores: Store[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/stores`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleCloseSnackbar = (): void => {
    setError("");
    setSuccessMessage("");
  };

  const handleLogout = (): void => {
    localStorage.clear();
    router.push("/auth/login");
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
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "20%" },
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            borderRadius: 2,
            p: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflow: "hidden",
            backgroundColor: "white",
            zIndex: 10,
            display: isMobile ? "none" : "flex",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mb: 3,
              textAlign: "center",
            }}
          >
            Admin Dashboard
          </Typography>

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

          <Box mt="auto">
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleLogout}
              sx={{
                fontWeight: "bold",
                mb: 5,
                py: 1.5,
                textTransform: "capitalize",
                backgroundColor: "#d32f2f",
                "&:hover": {
                  backgroundColor: "#c62828",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            width: { xs: "100%", md: "80%" },
            ml: { md: "20%" },
            px: 3,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Stack direction="row" flexWrap="wrap">
              <>
                {activeTab === "users" && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                      }}
                    >
                      <Typography
                        variant="h3"
                        textAlign={"center"}
                        sx={{
                          fontWeight: "bold",
                          color: "#1976d2",
                          mt: 3,
                          mb: 3,
                        }}
                      >
                        Users
                      </Typography>
                    </Box>

                    <Stack direction="row" flexWrap="wrap" spacing={3}>
                      {users.map((user) => (
                        <Box key={user.id} sx={{ width: { xs: "100%", sm: "48%", md: "30%" } }}>
                          <PrimaryCard
                            id={user.id}
                            first_name={user.first_name}
                            last_name={user.last_name}
                            role={user.role}
                            description={undefined}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </>
                )}
              </>

              {activeTab === "merchants" && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto",
                    }}
                  >
                    <Typography
                      variant="h3"
                      textAlign={"center"}
                      sx={{
                        fontWeight: "bold",
                        color: "#1976d2",
                        mt: 3,
                        mb: 3,
                      }}
                    >
                      Stores
                    </Typography>
                  </Box>

                  <Stack direction="row" flexWrap="wrap" spacing={3}>
                    {stores.map((store) => (
                      <Box key={store.id} sx={{ width: { xs: "100%", sm: "48%", md: "30%" } }}>
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
                </>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default AdminDashboard;
