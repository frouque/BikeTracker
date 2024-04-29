import 'dart:convert';
import 'package:http/http.dart' as http;

import 'constants/constants.dart' as Constants;
import 'models/ride.dart';

const apiBaseUrl = 'http://${Constants.SERVER_IP}:${Constants.SERVER_PORT}/api';

Future<Ride> createRide(int tracker_id) async {
  final response = await http.post(
    Uri.parse('$apiBaseUrl/rides'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode({
      'tracker_id': tracker_id,
    }),
  );

  if (response.statusCode == 201) {
    // If the server did return a 201 CREATED response,
    // then parse the JSON.
    return Ride.fromJson((jsonDecode(response.body) as Map<String, dynamic>)['ride']);
  } else {
    // If the server did not return a 201 CREATED response,
    // then throw an exception.
    throw Exception(response.body);
  }
}

Future<Ride> updateRide(int ride_id, String status) async {
  final response = await http.put(
    Uri.parse('$apiBaseUrl/rides/$ride_id'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode({
      'ride_id': ride_id,
      'status': status,
    }),
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return Ride.fromJson((jsonDecode(response.body) as Map<String, dynamic>)['ride']);
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to update ride.');
  }
}
