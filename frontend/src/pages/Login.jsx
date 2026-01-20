import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

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

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
          Welcome Back
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#888',
            textAlign: 'center',
            mb: 4
          }}
        >
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#e94560' },
                '&.Mui-focused fieldset': { borderColor: '#e94560' }
              },
              '& .MuiInputLabel-root': { color: '#888' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' }
            }}
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
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#e94560' },
                '&.Mui-focused fieldset': { borderColor: '#e94560' }
              },
              '& .MuiInputLabel-root': { color: '#888' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' }
            }}
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
            {loading ? 'Signing in...' : 'Sign In'}
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
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: '#e94560', textDecoration: 'none' }}
          >
            Register here
          </Link>
        </Typography>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#0f1629', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1 }}>
            Demo Credentials:
          </Typography>
          <Typography variant="caption" sx={{ color: '#aaa', display: 'block' }}>
            Admin: admin@movieapp.com / admin123
          </Typography>
          <Typography variant="caption" sx={{ color: '#aaa', display: 'block' }}>
            User: user@movieapp.com / user123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
