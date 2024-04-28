var promise = require('bluebird');
const dbConfig = require('./dbConfig');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
// var connectionString = 'postgres://localhost:5432/biketracker';
const connectionString = `postgres://${dbConfig.user}:${dbConfig.password}@localhost:5432/biketracker`;
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
  req.body.tracker_id = parseInt(req.body.tracker_id);
  db.one('insert into rides(tracker_id)' +
    'values(${tracker_id}) returning ride_id',
    req.body)
    .then(function () {
      const ride_id = data.ride_id;
      res.status(200)
        .json({
          status: 'success',
          message: `Started ride with id: ${ride_id}`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateRide(req, res, next) {
  db.none('update rides set status=$1, where id=$2',
    [req.body.status, parseInt(req.params.ride_id)])
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
  req.body.ride_id = parseInt(req.body.ride_id);
  req.body.lat = parseFloat(req.body.lat);
  req.body.long = parseFloat(req.body.long);
  req.body.speed = parseFloat(req.body.speed);
  db.none('insert into gps_data(ride_id, latitude, longitude, speed)' +
    'values(${tracker_id}, ${tracker_id}, ${tracker_id}, ${tracker_id}) returning gps_id',
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

function createUser(req, res, next) {
  db.one('insert into users(first_name, last_name)' +
    'values(${first_name}, ${last_name}) returning user_id',
    req.body)
    .then(function (data) {
      const user_id = data.user_id;
      res.status(200)
        .json({
          status: 'success',
          message: `User created with id: ${user_id}`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createTracker(req, res, next) {
  db.one('insert into trackers(user_id, name)' +
    'values(${user_id}, ${name}) returning tracker_id',
    req.body)
    .then(function (data) {
      const tracker_id = data.tracker_id;
      res.status(200)
        .json({
          status: 'success',
          message: `Tracker created with id: ${tracker_id}`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  createGpsData: createGpsData,
  createRide: createRide,
  createTracker: createTracker,
  createUser: createUser,
  updateRide: updateRide,
};

// getUserTrackers: getUserTrackers,
//   getUserRides: getUserRides,
//   getTrackerRides: getTrackerRides,
//   getRideGpsData: getRideGpsData