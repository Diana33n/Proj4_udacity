// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const port = 3000;

// Start up an instance of app
const app = express();

/* Middleware*/
// Configure express to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross-origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// GET endpoint to retrieve project data
app.get('/projectData', (req, res) => {
    res.json(projectData);
});

// POST endpoint to save project data
app.post('/projectData', (req, res) => {
    projectData = req.body;
    res.json({ success: true });
});

// GET endpoint for API key
app.get('/apiKey', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Setup server
app.listen(port, () => console.log(`Server is running on port ${port}!`));
