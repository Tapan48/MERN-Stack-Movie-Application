const express = require('express');
const { body } = require('express-validator');
const {
  getMovies,
  getMovie,
  getSortedMovies,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules for creating/updating movies
const movieValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('releaseYear')
    .notEmpty()
    .withMessage('Release year is required')
    .isInt({ min: 1800, max: new Date().getFullYear() + 5 })
    .withMessage('Please provide a valid release year'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
  body('genre')
    .notEmpty()
    .withMessage('At least one genre is required')
    .isArray()
    .withMessage('Genre must be an array'),
  body('director')
    .trim()
    .notEmpty()
    .withMessage('Director is required')
];

const movieUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('releaseYear')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() + 5 })
    .withMessage('Please provide a valid release year'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
  body('genre')
    .optional()
    .isArray()
    .withMessage('Genre must be an array')
];

// Public routes
router.get('/search', searchMovies);
router.get('/sorted', getSortedMovies);
router.get('/', getMovies);
router.get('/:id', getMovie);

// Admin only routes
router.post('/', protect, authorize('admin'), movieValidation, createMovie);
router.put('/:id', protect, authorize('admin'), movieUpdateValidation, updateMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router;
