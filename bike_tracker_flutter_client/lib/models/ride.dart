class Ride {
  final int ride_id;
  final int tracker_id;
  final String timestamp;
  final String status;

  const Ride({
    required this.ride_id,
    required this.tracker_id,
    required this.timestamp,
    required this.status,
  });

  Map<String, dynamic> get map {
    return {
      "ride_id": ride_id,
      "tracker_id": tracker_id,
      "timestamp": timestamp,
      "status": status,
    };
  }

  factory Ride.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'ride_id': int ride_id,
        'tracker_id': int tracker_id,
        'timestamp': String timestamp,
        'status': String status,
      } =>
        Ride(
          ride_id: ride_id,
          tracker_id: tracker_id,
          timestamp: timestamp,
          status: status,
        ),
      _ => throw const FormatException('Failed to load ride.'),
    };
  }
}
