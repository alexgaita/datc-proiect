const express = require('express');
const app = express();
const loginService = require('./services/login');
const zoneService = require('./services/zones');

app.use(express.json());


// GET /login
app.post('/login', async (req, res) => {
  loginService.handleLogin(req.body.userName, req.body.password, res);
});

// GET /zones
app.get('/zones', (req, res) => {
    zoneService.getAllZones(req,res);
});

// POST /zones
app.post('/zones', (req, res) => {
    zoneService.createZone(req,res);
});

// GET /isInZone
app.get('/isInZone', (req, res) => {
  zoneService.isInZone(req,res);
});

// PUT /zones/{id}
app.put('/zones/:id', (req, res) => {
  zoneService.updateZone(req,res);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
