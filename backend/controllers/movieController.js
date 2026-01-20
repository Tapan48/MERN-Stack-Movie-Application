const Movie = require('../models/Movie');
const { validationResult } = require('express-validator');

// @desc    Get all movies with pagination
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Movie.countDocuments();
    const movies = await Movie.find()
      .sort({ imdbRank: 1, rating: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get sorted movies
// @route   GET /api/movies/sorted
// @access  Public
exports.getSortedMovies = async (req, res, next) => {
  try {
    const { sortBy = 'rating', order = 'desc' } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Valid sort fields
    const validSortFields = ['title', 'rating', 'releaseYear', 'duration'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'rating';
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await Movie.countDocuments();
    const movies = await Movie.find()
      .sort({ [sortField]: sortOrder })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      sortBy: sortField,
      order: order === 'asc' ? 'asc' : 'desc',
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search movies by name or description
// @route   GET /api/movies/search
// @access  Public
exports.searchMovies = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    // Use text search or regex for partial matching
    const searchRegex = new RegExp(q, 'i');
    const query = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { director: searchRegex },
        { genre: searchRegex }
      ]
    };

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort({ rating: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      searchQuery: q,
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    req.body.createdBy = req.user.id;
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    await movie.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
