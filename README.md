
# Movie Booking Backend Project

<a href="https://documenter.getpostman.com/view/8904540/2sA35LVzEp" target="_blank"><img src="https://run.pstmn.io/button.svg" alt="Run in Postman"></a>

## Overview
This project is a movie booking backend system built using Node.js, Express, and MongoDB. It provides APIs for browsing movies, booking seats, canceling bookings, and admin operations.

## Features
- Browse movies
- Book seats for a movie
- Cancel a booking
- Admin operations like adding new movies and deleting movies

## Project Structure
- `index.js`: Main entry point setting up the server and connecting to MongoDB.
- `routes/movies.js`: Contains routes for browsing movies, booking seats, and canceling bookings.
- `middleware/auth.js`: Middleware for user authentication using JWT tokens.
- `middleware/authorize.js`: Middleware for role-based authorization.
- `models/Movie.js`: Schema for the Movie model.

## How to Run
1. Install dependencies: `npm install`
2. Start the server: `npm start`

## API Endpoints
- `GET /api/movies`: Browse movies
- `POST /api/movies`: Add a new movie
- `DELETE /api/movies/:id`: Delete a movie
- `POST /api/movies/book/:id`: Book seats for a movie
- `POST /api/movies/cancel/:id`: Cancel a booking

## Authentication
- JWT tokens are used for authentication.
- Users need to include a valid token in the `Authorization` header for protected routes.

## Authorization
- Role-based authorization is implemented using the `authorize` middleware.
- Admins have access to routes requiring the 'admin' role.

## Deployment
- The server runs on port 3000 by default.
- MongoDB Atlas is used for database storage.
