/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

interface FormData {
  email: string;
  password: string;
}

interface UserData {
  role: "customer" | "merchant" | "admin";
  [key: string]: any;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );

      const authToken = response.data.token;
      const user: UserData = response.data.user;
      setUserData(user);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userData", JSON.stringify(user));
      toast.success("Logged in successfully!");
      setOpenModal(true);
    } catch (error) {
      console.error("Login failed!", error);
      toast.error("Login failed! Please check your credentials.");
    }
  };

  const handleAcceptCookies = () => {
    if (userData) {
      Cookies.set("userData", JSON.stringify(userData), { expires: 1 });
      Cookies.set("cookiesAccepted", "true", { expires: 365 });
      setOpenModal(false);
      toast.success("Cookies accepted!");

      switch (userData.role) {
        case "customer":
          router.push("/dashboard/customer");
          break;
        case "merchant":
          router.push("/dashboard/merchant");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/");
      }
    }
  };

  const handleDeclineCookies = () => {
    Cookies.set("cookiesAccepted", "false", { expires: 365 });
    setOpenModal(false);
    toast.info("Cookies declined.");
    router.push("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          background: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ textAlign: "center", marginBottom: 3 }}
        >
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              background: "linear-gradient(90deg, #008080, #004d40)",
              color: "white",
              padding: "12px 0",
              marginTop: 2,
              "&:hover": {
                background: "linear-gradient(90deg, #004d40, #008080)",
              },
            }}
          >
            Login
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", marginTop: 2 }}
          >
            Don’t have an account? <Link href="/auth/register">Sign Up</Link>
          </Typography>
        </form>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Cookie Consent</DialogTitle>
        <DialogContent>
          <Typography>
            We use cookies to improve your experience. Do you accept cookies?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: "red",
              color: "#fff",
              textTransform: "none",
            }}
            onClick={handleDeclineCookies}
          >
            Decline
          </Button>
          <Button
            sx={{
              backgroundColor: "#008080",
              color: "#fff",
              textTransform: "none",
            }}
            onClick={handleAcceptCookies}
            color="primary"
            autoFocus
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
