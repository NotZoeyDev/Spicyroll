/*
    Main routing of the app
*/

// Imports
const path = require('path');

// Express router
const router = require('express').Router();

// Get our main page
router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'app.html'));
});

// Return the router
module.exports = router;