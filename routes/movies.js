const express = require('express');
const Movie = require('../models/Movie');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

// Browse movies
router.get('/', authenticate, async (req, res) => {
// router.get('/', async (req, res) => {
  // const movies = await Movie.find();
  const movies = await Movie.find().select('-bookings');
  res.send(movies);
});

// Admin routes
router.post('/', [authenticate, authorize('admin')], async (req, res) => {
  const { name, seatsAvailable, time, image, duration } = req.body;
  let movie = new Movie({ name, seatsAvailable, time, image, duration });
  movie = await movie.save();
  res.send(movie);
});

router.delete('/:id', [authenticate, authorize('admin')], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

// Booking routes for users
router.post('/book/:id', authenticate, async (req, res) => {
  const { seats } = req.body;
  const userId = req.user._id; // Assuming you have the user's ID available in req.user._id
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('Movie not found.');
  if (movie.seatsAvailable < seats) return res.status(400).send('Not enough seats available.');
  
  // Check if the user has already booked seats for this movie
  const bookingIndex = movie.bookings.findIndex(booking => booking.userId === userId);
  if (bookingIndex > -1) {
    // Calculate total seats booked by the user after this booking
    const totalSeatsAfterBooking = movie.bookings[bookingIndex].seats + parseInt(seats, 10);
    if (totalSeatsAfterBooking > 4) {
      return res.status(400).send('Cannot book more than 4 seats per user.');
    }
    // Update existing booking
    movie.bookings[bookingIndex].seats = totalSeatsAfterBooking;
  } else {
    if (seats > 4) {
      return res.status(400).send('Cannot book more than 4 seats per user.');
    }
    // Add new booking
    movie.bookings.push({ userId, seats: parseInt(seats, 10) });
  }

  // movie.seatsBooked += parseInt(seats, 10);
  movie.seatsAvailable -= parseInt(seats, 10);
  await movie.save();
  res.send('Booking successful.');
});

// Canceling a booking for a movie
router.post('/cancel/:id', authenticate, async (req, res) => {
  const userId = req.user._id; // Assuming you have the user's ID available in req.user._id
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('Movie not found.');

  const bookingIndex = movie.bookings.findIndex(booking => booking.userId === userId);
  if (bookingIndex === -1) return res.status(400).send('No bookings found for the user.');

  // Cancel the booking
  const seatsToCancel = movie.bookings[bookingIndex].seats;
  // movie.seatsBooked -= seatsToCancel;
  movie.seatsAvailable += seatsToCancel;
  movie.bookings.splice(bookingIndex, 1); // Remove the booking from the array

  await movie.save();
  res.send('Booking canceled successfully.');
});

module.exports = router;