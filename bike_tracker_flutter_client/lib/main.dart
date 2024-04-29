import 'package:flutter/material.dart';
import 'http_requests.dart';

import 'models/ride.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bike Tracker',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Bike Tracker'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool _rideStarted = false;
  String _apiResponse = 'No response to show';
  int trackerId = 1;
  int? currentRideId;

  void _getAllRides() {
    setState(() {

    });
  }

  void _toggleRide() {
    setState(() {
      if (!_rideStarted) {
        _startRide();
      } else {
        _endRide();
      }

      _rideStarted = !_rideStarted;
    });
  }

  void _startRide() async {
    currentRideId = (await createRide(trackerId)).map['ride_id'];
  }

  void _endRide() async {
    await updateRide(currentRideId!, 'ended');
    currentRideId = null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: _toggleRide,
              style:
              ElevatedButton.styleFrom(textStyle: TextStyle(fontSize: 26)),
              child: Text(
                _rideStarted ? 'End ride' : 'Start Ride',
              ),
            ),
            ElevatedButton(
              onPressed: _getAllRides,
              style:
              ElevatedButton.styleFrom(textStyle: TextStyle(fontSize: 26)),
              child: const Text(
                'Get all rides',
              ),
            ),
            Text(
              '$_apiResponse',
            )
          ],
        ),
      ),
    );
  }
}
