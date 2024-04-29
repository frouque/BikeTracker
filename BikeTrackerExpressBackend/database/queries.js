var promise = require('bluebird');
const dbConfig = require('./db_config');

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
    'values(${tracker_id}) returning ride_id, tracker_id, timestamp, status',
    req.body)
    .then(function (data) {
      const ride_id = data.ride_id;
      const tracker_id = data.tracker_id;
      const timestamp = data.timestamp;
      const status = data.status;
      res.status(201)
        .json({
          status: 'success',
          message: `Created Ride`,
          ride: {
            "ride_id": ride_id,
            "tracker_id": tracker_id,
            "timestamp": timestamp,
            "status": status,
          }
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateRide(req, res, next) {
  db.one('update rides set status=$1 where ride_id=$2 returning ride_id, tracker_id, timestamp, status',
    [req.body.status, parseInt(req.params.ride_id)])
    .then(function (data) {
      const ride_id = data.ride_id;
      const tracker_id = data.tracker_id;
      const timestamp = data.timestamp;
      const status = data.status;
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated ride',
          ride: {
            "ride_id": ride_id,
            "tracker_id": tracker_id,
            "timestamp": timestamp,
            "status": status,
          }
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
  db.one('insert into gps_data(ride_id, latitude, longitude, speed)' +
    'values(${tracker_id}, ${tracker_id}, ${tracker_id}, ${tracker_id}) returning gps_id, ride_id, latitude, longitude, speed, timestamp',
    req.body)
    .then(function (data) {
      const gps_id = data.gps_id;
      const ride_id = data.ride_id;
      const latitude = data.latitude;
      const longitude = data.longitude;
      const speed = data.speed;
      const timestamp = data.timestamp;
      res.status(200)
        .json({
          status: 'success',
          message: 'Created GpsData',
          gps_data: {
            "gps_id": gps_id,
            "ride_id": ride_id,
            "latitude": latitude,
            "longitude": longitude,
            "speed": speed,
            "timestamp": timestamp,
          }
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createUser(req, res, next) {
  db.one('insert into users(first_name, last_name)' +
    'values(${first_name}, ${last_name}) returning user_id, first_name, last_name',
    req.body)
    .then(function (data) {
      const user_id = data.user_id;
      const first_name = data.first_name;
      const last_name = data.last_name;
      res.status(200)
        .json({
          status: 'success',
          message: `Created User`,
          user: {
            "user_id": user_id,
            "first_name": first_name,
            "last_name": last_name,
          }
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createTracker(req, res, next) {
  db.one('insert into trackers(user_id, name)' +
    'values(${user_id}, ${name}) returning tracker_id, user_id, name',
    req.body)
    .then(function (data) {
      const tracker_id = data.tracker_id;
      const user_id = data.user_id;
      const name = data.name;
      res.status(200)
        .json({
          status: 'success',
          message: `Created Tracker`,
          tracker: {
            "tracker_id": tracker_id,
            "user_id": user_id,
            "name": name,
          }
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