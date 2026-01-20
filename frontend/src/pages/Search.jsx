import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Pagination,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { movieApi } from '../services/api';
import { toast } from 'react-toastify';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMovies = async (query, pageNum) => {
    if (!query.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const res = await movieApi.search(query, pageNum, 12);
      setMovies(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
      setHasSearched(true);
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchMovies(searchQuery, page);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, page]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            mb: 3
          }}
        >
          Search Movies
        </Typography>

        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search by title, description, director, or genre..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#16213e',
                color: 'white',
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#e94560' },
                '&.Mui-focused fieldset': { borderColor: '#e94560' }
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#888',
                opacity: 1
              }
            }}
          />
        </Box>

        {hasSearched && (
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', color: '#888', mt: 2 }}
          >
            Found {total} {total === 1 ? 'result' : 'results'} for "{searchQuery}"
          </Typography>
        )}
      </Box>

      {loading ? (
        <Loading message="Searching..." />
      ) : movies.length > 0 ? (
        <>
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
        </>
      ) : hasSearched ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: '#16213e',
            color: 'white'
          }}
        >
          <Typography variant="h6">No movies found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try searching with different keywords
          </Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: '#16213e',
            color: 'white'
          }}
        >
          <Typography variant="h6">Start Searching</Typography>
          <Typography variant="body2" color="text.secondary">
            Enter a movie title, description, director name, or genre to search
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Search;
