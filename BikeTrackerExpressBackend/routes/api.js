var express = require('express');
var router = express.Router();

var db = require('../database/queries');

// router.get('/api/trackers/:userid', db.getUserTrackers);
// router.get('/api/rides/:userid', db.getUserRides);
// router.get('/api/rides/:trackerid', db.getTrackerRides);
// router.get('/api/gpsdata/:rideid', db.getRideGpsData);

router.post('/api/gpsdata', db.createGpsData);
router.post('/api/rides', db.createRide);

router.put('/api/rides/:rideid', db.updateRide);

module.exports = router;