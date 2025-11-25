const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const app = express();


console.log("Lambda starting...");

const buildPath = path.join(__dirname, 'build');


app.use(express.static(buildPath));


app.get('/*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  res.sendFile(indexPath);
});

module.exports.handler = serverless(app);