import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';
import { movieApi } from '../../services/api';
import { toast } from 'react-toastify';

const AddMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: '',
    rating: '',
    duration: '',
    director: '',
    posterUrl: '',
    genreInput: '',
    castInput: ''
  });
  const [genres, setGenres] = useState([]);
  const [cast, setCast] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleAddGenre = () => {
    if (formData.genreInput.trim() && !genres.includes(formData.genreInput.trim())) {
      setGenres([...genres, formData.genreInput.trim()]);
      setFormData({ ...formData, genreInput: '' });
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setGenres(genres.filter(g => g !== genreToRemove));
  };

  const handleAddCast = () => {
    if (formData.castInput.trim() && !cast.includes(formData.castInput.trim())) {
      setCast([...cast, formData.castInput.trim()]);
      setFormData({ ...formData, castInput: '' });
    }
  };

  const handleRemoveCast = (castToRemove) => {
    setCast(cast.filter(c => c !== castToRemove));
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'genre') handleAddGenre();
      else if (type === 'cast') handleAddCast();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (genres.length === 0) {
      setError('Please add at least one genre');
      setLoading(false);
      return;
    }

    try {
      const movieData = {
        title: formData.title,
        description: formData.description,
        releaseYear: parseInt(formData.releaseYear),
        rating: parseFloat(formData.rating) || 0,
        duration: parseInt(formData.duration),
        director: formData.director,
        posterUrl: formData.posterUrl || undefined,
        genre: genres,
        cast: cast
      };

      await movieApi.create(movieData);
      toast.success('Movie added successfully!');
      navigate('/admin/manage');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add movie';
      setError(Array.isArray(message) ? message.join(', ') : message);
      toast.error('Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: 'white' }}
      >
        Back
      </Button>

      <Paper sx={{ p: 4, bgcolor: '#16213e', borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: 'white', fontWeight: 700, mb: 4 }}
        >
          Add New Movie
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Year"
                name="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={handleChange}
                required
                inputProps={{ min: 1800, max: new Date().getFullYear() + 5 }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rating (0-10)"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Poster URL"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Add Genre"
                  name="genreInput"
                  value={formData.genreInput}
                  onChange={handleChange}
                  onKeyPress={(e) => handleKeyPress(e, 'genre')}
                  placeholder="Press Enter to add"
                  sx={textFieldStyles}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddGenre}
                  sx={{ borderColor: '#e94560', color: '#e94560' }}
                >
                  <Add />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {genres.map((genre, index) => (
                  <Chip
                    key={index}
                    label={genre}
                    onDelete={() => handleRemoveGenre(genre)}
                    sx={{ bgcolor: '#e94560', color: 'white' }}
                  />
                ))}
              </Box>
              {genres.length === 0 && (
                <Typography variant="caption" sx={{ color: '#888', mt: 1, display: 'block' }}>
                  At least one genre is required
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Add Cast Member"
                  name="castInput"
                  value={formData.castInput}
                  onChange={handleChange}
                  onKeyPress={(e) => handleKeyPress(e, 'cast')}
                  placeholder="Press Enter to add"
                  sx={textFieldStyles}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddCast}
                  sx={{ borderColor: '#e94560', color: '#e94560' }}
                >
                  <Add />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {cast.map((member, index) => (
                  <Chip
                    key={index}
                    label={member}
                    onDelete={() => handleRemoveCast(member)}
                    variant="outlined"
                    sx={{ color: 'white', borderColor: '#444' }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
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
                {loading ? 'Adding Movie...' : 'Add Movie'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddMovie;
