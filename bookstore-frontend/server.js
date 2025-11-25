const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const app = express();

// serve static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// return index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports.handler = serverless(app);