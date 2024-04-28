DROP DATABASE IF EXISTS biketracker;
CREATE DATABASE biketracker;

\c biketracker;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR
    -- email VARCHAR,
    -- salt VARCHAR,
    -- passhash VARCHAR,
    -- profile_picture BYTEA
);

CREATE TABLE trackers (
    tracker_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    name VARCHAR
    -- tracker_image BYTEA
);

CREATE TYPE ride_status_type AS ENUM ('ongoing', 'ended');

CREATE TABLE rides (
    ride_id SERIAL PRIMARY KEY,
    tracker_id INT REFERENCES trackers(tracker_id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ride_status_type DEFAULT 'ongoing'
);

CREATE TABLE gps_data (
    gps_id SERIAL PRIMARY KEY,
    ride_id INT REFERENCES rides(ride_id),
    latitude DECIMAL,
    longitude DECIMAL,
    speed DECIMAL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);