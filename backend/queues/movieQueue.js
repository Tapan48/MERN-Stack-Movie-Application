const Queue = require('bull');
const Movie = require('../models/Movie');

// Create queue - will gracefully handle Redis unavailability
let movieQueue = null;
let isQueueAvailable = false;

const initializeQueue = () => {
  try {
    movieQueue = new Queue('movie-insertion', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    });

    movieQueue.on('ready', () => {
      isQueueAvailable = true;
      console.log('Movie queue connected to Redis');
    });

    movieQueue.on('error', (err) => {
      isQueueAvailable = false;
      console.log('Redis not available, using direct insertion');
    });

    // Process jobs
    movieQueue.process('insert-movie', async (job) => {
      const { movieData } = job.data;

      try {
        const existingMovie = await Movie.findOne({
          $or: [
            { imdbId: movieData.imdbId },
            { title: movieData.title, releaseYear: movieData.releaseYear }
          ]
        });

        if (!existingMovie) {
          await Movie.create(movieData);
          console.log(`Movie inserted: ${movieData.title}`);
        } else {
          console.log(`Movie already exists: ${movieData.title}`);
        }

        return { success: true, title: movieData.title };
      } catch (error) {
        console.error(`Error inserting movie ${movieData.title}:`, error.message);
        throw error;
      }
    });

    // Batch insertion processor
    movieQueue.process('insert-movies-batch', async (job) => {
      const { movies } = job.data;
      const results = { inserted: 0, skipped: 0, errors: 0 };

      for (const movieData of movies) {
        try {
          const existingMovie = await Movie.findOne({
            $or: [
              { imdbId: movieData.imdbId },
              { title: movieData.title, releaseYear: movieData.releaseYear }
            ]
          });

          if (!existingMovie) {
            await Movie.create(movieData);
            results.inserted++;
          } else {
            results.skipped++;
          }
        } catch (error) {
          results.errors++;
          console.error(`Error inserting movie:`, error.message);
        }
      }

      console.log(`Batch complete: ${results.inserted} inserted, ${results.skipped} skipped, ${results.errors} errors`);
      return results;
    });

    movieQueue.on('completed', (job, result) => {
      console.log(`Job ${job.id} completed`);
    });

    movieQueue.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed:`, err.message);
    });

  } catch (error) {
    console.log('Queue initialization failed, using direct insertion');
    isQueueAvailable = false;
  }
};

// Add single movie to queue
const addMovieToQueue = async (movieData) => {
  if (isQueueAvailable && movieQueue) {
    return await movieQueue.add('insert-movie', { movieData });
  } else {
    // Direct insertion fallback
    return await directInsertMovie(movieData);
  }
};

// Add batch of movies to queue
const addMoviesBatchToQueue = async (movies) => {
  if (isQueueAvailable && movieQueue) {
    return await movieQueue.add('insert-movies-batch', { movies });
  } else {
    // Direct insertion fallback
    return await directInsertMoviesBatch(movies);
  }
};

// Direct insertion fallback (when Redis is not available)
const directInsertMovie = async (movieData) => {
  try {
    const existingMovie = await Movie.findOne({
      $or: [
        { imdbId: movieData.imdbId },
        { title: movieData.title, releaseYear: movieData.releaseYear }
      ]
    });

    if (!existingMovie) {
      await Movie.create(movieData);
      console.log(`Movie inserted directly: ${movieData.title}`);
      return { success: true, title: movieData.title };
    }
    return { success: true, skipped: true, title: movieData.title };
  } catch (error) {
    console.error(`Error inserting movie:`, error.message);
    throw error;
  }
};

const directInsertMoviesBatch = async (movies) => {
  const results = { inserted: 0, skipped: 0, errors: 0 };

  for (const movieData of movies) {
    try {
      const existingMovie = await Movie.findOne({
        $or: [
          { imdbId: movieData.imdbId },
          { title: movieData.title, releaseYear: movieData.releaseYear }
        ]
      });

      if (!existingMovie) {
        await Movie.create(movieData);
        results.inserted++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      results.errors++;
    }
  }

  console.log(`Direct batch: ${results.inserted} inserted, ${results.skipped} skipped`);
  return results;
};

// Get queue stats
const getQueueStats = async () => {
  if (!isQueueAvailable || !movieQueue) {
    return { available: false, message: 'Queue not available' };
  }

  const waiting = await movieQueue.getWaitingCount();
  const active = await movieQueue.getActiveCount();
  const completed = await movieQueue.getCompletedCount();
  const failed = await movieQueue.getFailedCount();

  return {
    available: true,
    waiting,
    active,
    completed,
    failed
  };
};

module.exports = {
  initializeQueue,
  addMovieToQueue,
  addMoviesBatchToQueue,
  getQueueStats,
  isQueueAvailable: () => isQueueAvailable
};
