require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

app.use("/", (req, res) => res.send("Movie booking backend"))

// Routes
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));

app.listen(port, () => console.log('Server ready on port 3000.'));

module.exports = app;