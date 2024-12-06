/* eslint-disable @typescript-eslint/no-explicit-any */
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
    Grid,
    TextField,
    Modal,
    Fade,
    Backdrop,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AddCircle, Edit } from "@mui/icons-material";
import PrimaryCard from "../../../components/PrimaryCard";

const AdminDashboard: React.FC = () => {
    const router = useRouter();
    const [stores, setStores] = useState<any[]>([]);
    const [newStoreName, setNewStoreName] = useState("");
    const [newStoreDescription, setNewStoreDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [storeToEdit, setStoreToEdit] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"users" | "merchants">("users");
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
                        Merchant Dashboard
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
                        ml: { md: "25%" },
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
                        <>
                            <>
                                {activeTab === "users" && (
                                    <Grid
                                        container
                                        justifyContent="center" // Centers horizontally
                                        alignItems="center" // Centers vertically
                                        sx={{ minHeight: "100vh" }} // Ensures the grid takes the full height of the viewport
                                    >
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
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                    sx={{ fontWeight: "bold" }}
                                                >
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
                                                    onChange={(e) =>
                                                        setNewStoreDescription(e.target.value)
                                                    }
                                                    variant="outlined"
                                                    multiline
                                                    rows={4}
                                                    sx={{ mb: 2 }}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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

                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                            </>
                            <>
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

                                        <Stack direction="row" flexWrap="wrap">
                                            {stores.map((store) => (
                                                <Box key={store.id}>
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
                            </>
                        </>
                    )}
                </Box>
            </Stack>
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
        </Box>
    );
};

export default AdminDashboard;
