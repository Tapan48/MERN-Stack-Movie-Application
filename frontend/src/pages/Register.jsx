import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: '#444' },
      '&:hover fieldset': { borderColor: '#e94560' },
      '&.Mui-focused fieldset': { borderColor: '#e94560' }
    },
    '& .MuiInputLabel-root': { color: '#888' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: '#16213e',
          borderRadius: 2
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 700,
            textAlign: 'center',
            mb: 3
          }}
        >
          Create Account
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#888',
            textAlign: 'center',
            mb: 4
          }}
        >
          Join us to explore amazing movies
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={textFieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#888' }} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={textFieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#888' }} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            sx={textFieldStyles}
            helperText="Minimum 6 characters"
            FormHelperTextProps={{ sx: { color: '#666' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#888' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#888' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={textFieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#888' }} />
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              bgcolor: '#e94560',
              '&:hover': { bgcolor: '#d13550' },
              '&:disabled': { bgcolor: '#555' }
            }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#888',
            textAlign: 'center',
            mt: 3
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: '#e94560', textDecoration: 'none' }}
          >
            Sign in here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
