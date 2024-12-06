/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";

interface formData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

const register: React.FC = () => {
  const [formData, setFormData] = useState<formData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const selectHandleChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    console.log("userData --- ", userData);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      router.push("/auth/login");
      setIsSignupSuccess(true);
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        margin: "auto",
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
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        {!isSignupSuccess ? (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />
            <InputLabel id="role">Choose a role</InputLabel>
            <Select
              labelId="role"
              value={formData.role}
              label="Role"
              onChange={selectHandleChange}
              name="role"
              sx={{ width: "100%" }}
            >
              <MenuItem value="" disabled>
                Choose a role
              </MenuItem>
              <MenuItem value="merchant">Merchant</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                background: "linear-gradient(90deg, #008080, #004d40)", // Linear gradient for button
                color: "white",
                padding: "12px 0",
                marginTop: 2,
                "&:hover": {
                  background: "linear-gradient(90deg, #004d40, #008080)", // Gradient on hover
                },
                mt: 2,
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Sign Up"
              )}
            </Button>
            <p style={{ textAlign: "center", marginTop: 10 }}>
              Already have an account? <Link href="/auth/login">Login</Link>
            </p>
          </form>
        ) : (
          <Box>
            {/* <SubscriptionCards
              onSelectSubscription={handleSubscriptionSelect}
            /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default register;
