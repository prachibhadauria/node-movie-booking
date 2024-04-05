const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  name: { type: String, required: true },
  seatsAvailable: { type: Number, required: true },
  time: { type: String, required: true },
  image: { type: String, required: true },
  bookings: [{ userId: String, seats: Number }],
  duration: { type: String, required: true }
});

module.exports = mongoose.model('Movie', movieSchema);