import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { movieApi } from '../services/api';
import { toast } from 'react-toastify';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('imdbRank');
  const [order, setOrder] = useState('asc');

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let res;
      if (sortBy === 'imdbRank') {
        res = await movieApi.getAll(page, 12);
      } else {
        res = await movieApi.getSorted(sortBy, order, page, 12);
      }
      setMovies(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch movies');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, sortBy, order]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleOrderChange = (event, newOrder) => {
    if (newOrder !== null) {
      setOrder(newOrder);
      setPage(1);
    }
  };

  if (loading && movies.length === 0) {
    return <Loading message="Loading movies..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            mb: 1
          }}
        >
          IMDb Top Movies
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ textAlign: 'center', color: '#888', mb: 3 }}
        >
          Discover the highest-rated movies of all time
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
            mb: 3
          }}
        >
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel sx={{ color: '#888' }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e94560' },
                '.MuiSvgIcon-root': { color: 'white' }
              }}
            >
              <MenuItem value="imdbRank">IMDb Rank</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="releaseYear">Release Year</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
            </Select>
          </FormControl>

          {sortBy !== 'imdbRank' && (
            <ToggleButtonGroup
              value={order}
              exclusive
              onChange={handleOrderChange}
              size="small"
            >
              <ToggleButton
                value="asc"
                sx={{
                  color: order === 'asc' ? '#e94560' : '#888',
                  borderColor: '#444'
                }}
              >
                <ArrowUpward /> Asc
              </ToggleButton>
              <ToggleButton
                value="desc"
                sx={{
                  color: order === 'desc' ? '#e94560' : '#888',
                  borderColor: '#444'
                }}
              >
                <ArrowDownward /> Desc
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white',
                borderColor: '#444'
              },
              '& .Mui-selected': {
                bgcolor: '#e94560 !important'
              }
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default Home;
