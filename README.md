# Bike Tracker

App to track motorcycle rides
## Key Components
<ul>
    <li>
        <strong>ESP32</strong> and <strong>Adafruit Ultimate GPS Breakout</strong> modules to collect bike's GPS data
    </li>
    <li>
        <strong>Flutter / Kotlin</strong> mobile app to interact with GPS tracker over Bluetooth and send data to server
    </li>
    <li>
        <strong>Express JS</strong> Backend with <strong>PostgreSQL</strong> database
    </li>
    <li>
        <strong>React</strong> Web Client to view Historical and Realtime data on GPS tracker
    </li>
</ul>

## Basic Flow of App
<ol>
    <li>
        User clicks "Start Ride" button on Mobile App
    </li>
    <li>
        GPS Tracker starts sending GPS data to Phone over Bluetooth
    </li>
    <li>
        Phone sends GPS data to Express.js server through API
    </li>
    <li>
        Server writes GPS data into PostgreSQL database
    </li>
    <li>
        User can access "Ongoing Rides" on Mobile App or Web Client and see latest GPS update
    </li>
    <li>
        User clicks "Stop Ride" button on Mobile App, tracker stops sending GPS data
    </li>
    <li>
        User can access "Ride History" on Mobile App or Web Client and view the full ride
    </li>
</ol>
