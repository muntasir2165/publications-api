const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const publicationRoutes = require('./routes/publication');
const publicationsByLoggedInUserRoute = require('./routes/publicationsByLoggedInUser');
const userRoutes = require('./routes/user');
const auth = require('./middleware/auth');

// Load env variables
dotenv.config();

// Create the application
const app = express();

// Parse request body as JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// for testing purposes:
// app.get('/', (req, res, next) => res.end('Welcome!'));

app.use('/api/publications', auth, publicationRoutes);
app.use(
  '/api/publicationsbyloggedinuser',
  auth,
  publicationsByLoggedInUserRoute
);
app.use('/api/users', userRoutes);

// the following handles undefined routes in our app
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// please note the 'error' object as the first parameter
// this is invoked when we call 'next(error)' from anywhere
// in our app
app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({ error: { message: error.message } });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB!');
    return app.listen(PORT);
  })
  .then(() => console.log(`Server running at port: ${PORT}`.yellow.bold))
  .catch((error) => console.log(error.message));
