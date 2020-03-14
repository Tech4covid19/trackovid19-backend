const express = require('express');
const helmet = require('helmet');

require('dotenv').config();

const routes = require('./app/route');

const app = express();

// Add some basic security
app.use(helmet());

const port = process.env.SERVER_PORT || 3000; // set our port

app.use('/', routes);

app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    success: false,
    message: err.message || 'An error occured.',
    errors: err.error || [],
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found.' });
});

// Start the server
app.listen(port);

console.log(`Server started on port ${port}`);
