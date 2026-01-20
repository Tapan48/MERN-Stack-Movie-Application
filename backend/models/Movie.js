const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a movie title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  releaseYear: {
    type: Number,
    required: [true, 'Please add a release year']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [10, 'Rating cannot be more than 10'],
    default: 0
  },
  duration: {
    type: Number,
    required: [true, 'Please add movie duration in minutes']
  },
  genre: {
    type: [String],
    required: [true, 'Please add at least one genre']
  },
  director: {
    type: String,
    required: [true, 'Please add director name']
  },
  cast: {
    type: [String],
    default: []
  },
  posterUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=No+Poster'
  },
  imdbId: {
    type: String,
    unique: true,
    sparse: true
  },
  imdbRank: {
    type: Number
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
MovieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for search and sort performance
MovieSchema.index({ title: 'text', description: 'text' });
MovieSchema.index({ rating: -1 });
MovieSchema.index({ releaseYear: -1 });
MovieSchema.index({ title: 1 });
MovieSchema.index({ duration: 1 });

module.exports = mongoose.model('Movie', MovieSchema);
