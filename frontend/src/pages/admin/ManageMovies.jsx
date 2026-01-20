import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Rating
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  ArrowBack
} from '@mui/icons-material';
import Loading from '../../components/Loading';
import { movieApi } from '../../services/api';
import { toast } from 'react-toastify';

const ManageMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMovie, setDeleteMovie] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await movieApi.getAll(page + 1, rowsPerPage);
      setMovies(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Edit handlers
  const handleEditOpen = (movie) => {
    setEditMovie({ ...movie });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditMovie(null);
  };

  const handleEditChange = (e) => {
    setEditMovie({
      ...editMovie,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    try {
      const updateData = {
        title: editMovie.title,
        description: editMovie.description,
        releaseYear: parseInt(editMovie.releaseYear),
        rating: parseFloat(editMovie.rating),
        duration: parseInt(editMovie.duration),
        director: editMovie.director,
        posterUrl: editMovie.posterUrl,
        genre: editMovie.genre,
        cast: editMovie.cast
      };

      await movieApi.update(editMovie._id, updateData);
      toast.success('Movie updated successfully!');
      handleEditClose();
      fetchMovies();
    } catch (error) {
      toast.error('Failed to update movie');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteOpen = (movie) => {
    setDeleteMovie(movie);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteMovie(null);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await movieApi.delete(deleteMovie._id);
      toast.success('Movie deleted successfully!');
      handleDeleteClose();
      fetchMovies();
    } catch (error) {
      toast.error('Failed to delete movie');
    } finally {
      setDeleteLoading(false);
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

  if (loading && movies.length === 0) {
    return <Loading message="Loading movies..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: 'white' }}
      >
        Back to Home
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
          Manage Movies
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/add')}
          sx={{ bgcolor: '#e94560', '&:hover': { bgcolor: '#d13550' } }}
        >
          Add Movie
        </Button>
      </Box>

      <Paper sx={{ bgcolor: '#16213e', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Rank</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Year</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Rating</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Director</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie._id} hover sx={{ '&:hover': { bgcolor: '#1a1a3e' } }}>
                  <TableCell sx={{ color: '#ffd700' }}>
                    {movie.imdbRank ? `#${movie.imdbRank}` : '-'}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{movie.title}</TableCell>
                  <TableCell sx={{ color: '#aaa' }}>{movie.releaseYear}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={movie.rating / 2} precision={0.1} readOnly size="small"
                        sx={{ '& .MuiRating-iconFilled': { color: '#ffd700' } }} />
                      <Typography variant="body2" sx={{ color: '#ffd700' }}>
                        {movie.rating?.toFixed(1)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#aaa' }}>{movie.duration} min</TableCell>
                  <TableCell sx={{ color: '#aaa' }}>{movie.director}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEditOpen(movie)}
                      sx={{ color: '#4dabf5' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteOpen(movie)}
                      sx={{ color: '#f44336' }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            color: 'white',
            '.MuiTablePagination-selectIcon': { color: 'white' },
            '.MuiTablePagination-select': { color: 'white' }
          }}
        />
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#16213e', color: 'white' } }}
      >
        <DialogTitle>Edit Movie</DialogTitle>
        <DialogContent>
          {editMovie && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={editMovie.title}
                  onChange={handleEditChange}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editMovie.description}
                  onChange={handleEditChange}
                  multiline
                  rows={3}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Release Year"
                  name="releaseYear"
                  type="number"
                  value={editMovie.releaseYear}
                  onChange={handleEditChange}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Rating"
                  name="rating"
                  type="number"
                  value={editMovie.rating}
                  onChange={handleEditChange}
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={editMovie.duration}
                  onChange={handleEditChange}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Director"
                  name="director"
                  value={editMovie.director}
                  onChange={handleEditChange}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Poster URL"
                  name="posterUrl"
                  value={editMovie.posterUrl}
                  onChange={handleEditChange}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                  Genres
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {editMovie.genre?.map((g, i) => (
                    <Chip key={i} label={g} sx={{ bgcolor: '#e94560', color: 'white' }} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} sx={{ color: '#888' }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            disabled={editLoading}
            sx={{ color: '#e94560' }}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        PaperProps={{ sx: { bgcolor: '#16213e', color: 'white' } }}
      >
        <DialogTitle>Delete Movie</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteMovie?.title}"?
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} sx={{ color: '#888' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            sx={{ color: '#f44336' }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageMovies;
