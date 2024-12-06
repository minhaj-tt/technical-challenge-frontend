"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "../../context/authContext";
import PrimaryCard from "../../../components/PrimaryCard";
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
  IconButton,
  Stack,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const AdminDashboard = () => {
  //   const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  useEffect(() => {
    fetchData();
  }, []);
  // dummy array
  // setUsers(dummyUsers);
  // Check for authentication and admin role
  //   useEffect(() => {
  //     if (!isAuthenticated || user.role !== "admin") {
  //       router.push("/login"); // Redirect to login if not authenticated or not an admin
  //     }
  //   }, [isAuthenticated, user, router]);

  // Fetch users and stores data for the admin
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

  // Clear error and success messages
  const handleCloseSnackbar = () => {
    setError("");
    setSuccessMessage("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          my: 3,
          textAlign: "center",
          fontWeight: "bold",
          color: "text.primary",
        }}
      >
        Admin Dashboard
      </Typography>

      <Stack sx={{ flexDirection: "row" }}>
        <Stack
          sx={{
            width: { xs: "100%", md: "20%" },
            borderRadius: 2,
            padding: 2,
            boxShadow: 3,
            bgcolor: "background.paper",
          }}
          spacing={3}
        >
          <Button
            fullWidth
            variant={activeTab === "users" ? "contained" : "outlined"}
            color="primary"
            sx={{
              fontWeight: "bold",
              borderRadius: 1,
              textTransform: "none",
              boxShadow: activeTab === "users" ? 3 : 1,
            }}
            onClick={() => handleActiveTab("users")}
          >
            Users
          </Button>
          <Button
            fullWidth
            variant={activeTab === "merchants" ? "contained" : "outlined"}
            color="primary"
            sx={{
              fontWeight: "bold",
              borderRadius: 1,
              textTransform: "none",
              boxShadow: activeTab === "merchants" ? 3 : 1,
            }}
            onClick={() => handleActiveTab("merchants")}
          >
            Merchants
          </Button>
        </Stack>

        <Stack
          sx={{
            flexDirection: "row",
            gap: 2,
            justifyContent: "flex-start",
            flexWrap: "wrap",
            width: "80%",
            px: 3,
          }}
        >
          {activeTab === "users"
            ? users.map((user, index) => (
              <Box
                key={index}
                sx={{ width: { xs: "100%", sm: "48%" }, mb: 2 }}
              >
                <PrimaryCard
                  first_name={user.first_name}
                  last_name={user.last_name}
                  role={user.role}
                />
              </Box>
            ))
            : stores.map((store, index) => (
              <Box
                key={index}
                sx={{ width: { xs: "100%", sm: "48%" }, mb: 2 }}
              >
                <PrimaryCard
                  first_name={store.name}
                  last_name={store.description}
                  role={store.active}
                />
              </Box>
            ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default AdminDashboard;

// <Container maxWidth="lg" sx={{ mt: 4 }}>
//   <Typography variant="h4" gutterBottom>
//     Admin Dashboard
//   </Typography>

//   {/* Display success or error message */}
//   <Snackbar
//     open={!!error || !!successMessage}
//     autoHideDuration={6000}
//     onClose={handleCloseSnackbar}
//     message={error || successMessage}
//     anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//   />

//   <Grid container spacing={3}>
//     {/* Users list */}
//     <Grid item xs={12} md={6}>
//       <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 2 }}>
//         <Typography variant="h6" gutterBottom>
//           Manage Users
//         </Typography>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <List>
//             {users.length === 0 ? (
//               <Typography>No users found.</Typography>
//             ) : (
//               users.map((user, index) => (
//                 <ListItem
//                   key={index}
//                   sx={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <ListItemText
//                     primary={`${user.first_name} ${user.last_name} (${user.role})`}
//                   />
//                   <Box>
//                     <IconButton
//                       color="primary"
//                       onClick={() => router.push(`/admin/users/edit/${user}`)}
//                     >
//                       <Edit />
//                     </IconButton>
//                     <IconButton
//                       color="secondary"
//                       onClick={() => handleDeleteUser(index.toString())}
//                     >
//                       <Delete />
//                     </IconButton>
//                   </Box>
//                 </ListItem>
//               ))
//             )}
//           </List>
//         )}
//       </Box>
//     </Grid>
//     <Grid item xs={12} md={6}>
//       <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 2 }}>
//         <Typography variant="h6" gutterBottom>
//           Manage Stores
//         </Typography>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <List>
//             {dummyStores.length === 0 ? (
//               <Typography>No stores found.</Typography>
//             ) : (
//               dummyStores.map((store) => (
//                 <ListItem
//                   key={store.id}
//                   sx={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <ListItemText primary={store.name} />
//                   <Box>
//                     <IconButton
//                       color="primary"
//                       onClick={() =>
//                         router.push(`/admin/stores/edit/${store.id}`)
//                       }
//                     >
//                       <Edit />
//                     </IconButton>
//                     <IconButton
//                       color="secondary"
//                       onClick={() => handleDeleteStore(store.id)}
//                     >
//                       <Delete />
//                     </IconButton>
//                   </Box>
//                 </ListItem>
//               ))
//             )}
//           </List>
//         )}
//       </Box>
//     </Grid>
//   </Grid>
// </Container>
{
  /* <Box>
  <Typography variant="h4" component="h2" sx={{ my: 2, textAlign: "center" }}>
    Admin DashBoard
  </Typography>

  <Stack sx={{ flexDirection: "row" }}>
    <Stack
      sx={{
        width: { xs: "100%", md: "20%" },
        border: "1px solid #ddd",
        borderRadius: 2,
        padding: 2,
        boxShadow: 2,
      }}
      spacing={3}
    >
      <Button
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          border:
            activeTab == "users" ? "1px solid blue" : "1px solid transparent",
        }}
        onClick={() => handleActiveTab("users")}
      >
        Users
      </Button>
      <Button
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          border:
            activeTab == "merchants"
              ? "1px solid blue"
              : "1px solid transparent",
        }}
        onClick={() => handleActiveTab("merchants")}
      >
        Merchants
      </Button>
    </Stack>
    <Stack
      sx={{
        flexDirection: "row",
        gap: 3,
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        width: "80%",
      }}
    >
      {activeTab == "users"
        ? users.map((user, index) => (
            <Box key={index}>
              <PrimaryCard
                first_name={user.first_name}
                last_name={user.last_name}
                role={user.role}
              />
            </Box>
          ))
        : stores.map((user, index) => (
            <Box key={index}>
              <PrimaryCard
                first_name={user.name}
                last_name={user.description}
                role={user.active}
              />
            </Box>
          ))}
    </Stack>
  </Stack>
</Box>;
 */
}
