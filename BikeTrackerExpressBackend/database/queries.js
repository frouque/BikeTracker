var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/biketracker';
var db = pgp(connectionString);

// add query functions

/**
 * create one gps data
 * create one ride
 * get all of the user's trackers
 * get all of the user's rides
 * get all of the tracker's rides
 * get all of the ride's gps data
 */



function createRide(req, res, next) {
  req.body.trackerid = parseInt(req.body.trackerid);
  db.none('insert into rides(tracker_id)' +
    'values(${tracker_id})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Started ride'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateRide(req, res, next) {
  db.none('update rides set status=$1, where id=$2',
    [req.body.status, parseInt(req.params.rideid)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated ride'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createGpsData(req, res, next) {
  req.body.rideid = parseInt(req.body.rideid);
  req.body.lat = parseFloat(req.body.lat);
  req.body.long = parseFloat(req.body.long);
  req.body.speed = parseFloat(req.body.speed);
  db.none('insert into gps_data(ride_id, latitude, longitude, speed)' +
    'values(${tracker_id}, ${tracker_id}, ${tracker_id}, ${tracker_id})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Started ride'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  createGpsData: createGpsData,
  createRide: createRide,
  updateRide: updateRide,
};

// getUserTrackers: getUserTrackers,
//   getUserRides: getUserRides,
//   getTrackerRides: getTrackerRides,
//   getRideGpsData: getRideGpsData