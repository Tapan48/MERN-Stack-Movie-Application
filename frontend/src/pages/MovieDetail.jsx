import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Paper,
  Rating,
  Button,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  AccessTime,
  CalendarMonth,
  Person,
  Movie as MovieIcon
} from '@mui/icons-material';
import Loading from '../components/Loading';
import { movieApi } from '../services/api';
import { toast } from 'react-toastify';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await movieApi.getById(id);
        setMovie(res.data.data);
      } catch (error) {
        toast.error('Movie not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, navigate]);

  if (loading) {
    return <Loading message="Loading movie details..." />;
  }

  if (!movie) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: 'white' }}
      >
        Back
      </Button>

      <Paper
        sx={{
          bgcolor: '#16213e',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Grid container>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.title}
              sx={{
                width: '100%',
                height: { xs: 400, md: '100%' },
                objectFit: 'cover'
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ p: 4 }}>
              {movie.imdbRank && (
                <Chip
                  icon={<MovieIcon sx={{ color: '#ffd700 !important' }} />}
                  label={`#${movie.imdbRank} on IMDb Top 250`}
                  sx={{
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                    color: '#ffd700',
                    mb: 2
                  }}
                />
              )}

              <Typography
                variant="h3"
                component="h1"
                sx={{ color: 'white', fontWeight: 700, mb: 2 }}
              >
                {movie.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Rating
                  value={movie.rating / 2}
                  precision={0.1}
                  readOnly
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': { color: '#ffd700' },
                    '& .MuiRating-iconEmpty': { color: '#555' }
                  }}
                />
                <Typography variant="h5" sx={{ color: '#ffd700', fontWeight: 600 }}>
                  {movie.rating?.toFixed(1)}/10
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {movie.genre?.map((g, index) => (
                  <Chip
                    key={index}
                    label={g}
                    sx={{
                      bgcolor: '#e94560',
                      color: 'white'
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth sx={{ color: '#888' }} />
                  <Typography color="text.secondary">
                    {movie.releaseYear}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ color: '#888' }} />
                  <Typography color="text.secondary">
                    {movie.duration} minutes
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: '#888' }} />
                  <Typography color="text.secondary">
                    {movie.director}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: '#333', my: 3 }} />

              <Typography
                variant="h6"
                sx={{ color: 'white', mb: 1 }}
              >
                Synopsis
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#ccc', lineHeight: 1.8 }}
              >
                {movie.description}
              </Typography>

              {movie.cast && movie.cast.length > 0 && (
                <>
                  <Divider sx={{ borderColor: '#333', my: 3 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', mb: 2 }}
                  >
                    Cast
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {movie.cast.map((actor, index) => (
                      <Chip
                        key={index}
                        label={actor}
                        variant="outlined"
                        sx={{
                          color: 'white',
                          borderColor: '#444'
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MovieDetail;
