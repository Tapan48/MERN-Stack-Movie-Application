import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Rating
} from '@mui/material';
import { AccessTime, CalendarMonth } from '@mui/icons-material';

const MovieCard = ({ movie }) => {
  return (
    <Card
      component={Link}
      to={`/movie/${movie._id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        bgcolor: '#16213e',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.4)'
        }
      }}
    >
      <CardMedia
        component="img"
        height="350"
        image={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
        alt={movie.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, color: 'white' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {movie.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={movie.rating / 2}
            precision={0.1}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconFilled': { color: '#ffd700' },
              '& .MuiRating-iconEmpty': { color: '#555' }
            }}
          />
          <Typography variant="body2" sx={{ ml: 1, color: '#ffd700' }}>
            {movie.rating?.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarMonth sx={{ fontSize: 16, color: '#888' }} />
            <Typography variant="body2" color="text.secondary">
              {movie.releaseYear}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 16, color: '#888' }} />
            <Typography variant="body2" color="text.secondary">
              {movie.duration} min
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {movie.genre?.slice(0, 3).map((g, index) => (
            <Chip
              key={index}
              label={g}
              size="small"
              sx={{
                bgcolor: '#e94560',
                color: 'white',
                fontSize: '0.7rem'
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
