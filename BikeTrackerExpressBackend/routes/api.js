var express = require('express');
var path = require('path');
var router = express.Router();

var db = require('../database/queries');

// router.get('/trackers/:userid', db.getUserTrackers);
// router.get('/rides/:userid', db.getUserRides);
// router.get('/rides/:trackerid', db.getTrackerRides);
// router.get('/gpsdata/:rideid', db.getRideGpsData);

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../BikeTrackerReactClient/build', 'index.html'));
    // res.render('index', { title: 'Express' });
});

router.post('/gpsdata', db.createGpsData);
router.post('/rides', db.createRide);
router.post('/trackers', db.createTracker);
router.post('/users', db.createUser);

router.put('/rides/:rideid', db.updateRide);

module.exports = router;