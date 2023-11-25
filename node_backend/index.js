const express = require('express');
const app = express();
const loginService = require('./services/login');
const zoneService = require('./services/zones');
const statisticsService = require('./services/statistics');
require('dotenv').config();

app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello world!' });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Hello world!' });
});

// GET /login
app.post('/login', async (req, res) => {
    loginService.handleLogin(req.body.userName, req.body.password, res);
});

// GET /zones
app.get('/zones', (req, res) => {
    zoneService.getAllZones(req, res);
});

// POST /zones
app.post('/zones', (req, res) => {
    zoneService.createZone(req, res);
});

// GET /isInZone
app.get('/isInZone', async (req, res) => {
    try {
       await zoneService.isInZone(req, res);
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// PUT /zones/{id}
app.put('/zones/:id', (req, res) => {
    zoneService.updateZone(req, res);
});

app.get('/statistics', (req, res) => {
    statisticsService.getStatistics(req, res);
});

app.get('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {

    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
