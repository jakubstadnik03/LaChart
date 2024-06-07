import React, { useState } from "react";
import { loginUser, registerUser } from '../apiService'; // Ensure correct path
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  TextField,
  Container,
  CssBaseline,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar
} from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    try {
      await loginUser(email, password);
      setIsLoggedIn(true);
      navigate('/'); // Navigate to main page or dashboard
      setLoading(false);
    } catch (error) {
      setError("Login Failed: " + error.message);
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      // Prepare the form data object
      const data = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };
  
      // Call register function
      const registeredData = await registerUser(data);
      console.log("Registration successful", registeredData);
  
      navigate('/login'); 
    } catch (error) {
      console.error("Registration failed:", error.message);
      setError(error.message || "Failed to register");
      setOpen(true); // Open the Snackbar to show the error
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={6} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5">Sign in</Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Sign In
          </Button>
          <Button type="button" fullWidth variant="text" onClick={() => setOpen(true)}>
            Not registered? Sign up
          </Button>
          </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="userName"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={formData.userName}
            onChange={handleChange}
          />
        
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={formData.password}
              onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                variant="standard"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleRegister}>Register</Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={error !== ''}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={error}
          />
          </Paper>
          <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(45deg, #93A5CF 30%, #E4EfE9 90%)",
          zIndex: -1,
          opacity: 0.75,
        }}
      ></Box>
        </Container>
      );
    };
    
    export default Login;
    