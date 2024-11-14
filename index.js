const express = require('express');
const path = require('path');

const app = express();
const { PORT } = require('./utils');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Route to test
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
