// Test code for Ultimate GPS Using Hardware Serial (e.g. GPS Flora or FeatherWing)
//
// This code shows how to listen to the GPS module via polling. Best used with
// Feathers or Flora where you have hardware Serial and no interrupt
//
// Tested and works great with the Adafruit GPS FeatherWing
// ------> https://www.adafruit.com/products/3133
// or Flora GPS
// ------> https://www.adafruit.com/products/1059
// but also works with the shield, breakout
// ------> https://www.adafruit.com/products/1272
// ------> https://www.adafruit.com/products/746
//
// Pick one up today at the Adafruit electronics shop
// and help support open source hardware & software! -ada

#include <Adafruit_GPS.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

// what's the name of the hardware serial port?
#define GPSSerial Serial2

// Connect to the GPS on the hardware port
Adafruit_GPS GPS(&GPSSerial);

// Set GPSECHO to 'false' to turn off echoing the GPS data to the Serial console
// Set to 'true' if you want to debug and listen to the raw GPS sentences
#define GPSECHO false

uint32_t timer = millis();

const char* ssid = "farouk's phone";
const char* password = "supersecretpassword";

String serverName = "http://10.0.0.224:8000/";
HTTPClient http;

void setup() {
  //while (!Serial);  // uncomment to have the sketch wait until Serial is ready

  // connect at 115200 so we can read the GPS fast enough and echo without dropping chars
  // also spit it out
  Serial.begin(115200);
  Serial.println("Adafruit GPS library basic parsing test!");

  WiFi.begin(ssid, password);
  Serial.println("\nConnecting");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());

  // HTTPClient http;

  String serverPath = serverName + "";

  // Your Domain name with URL path or IP address with path
  http.begin(serverPath.c_str());
  // int httpResponseCode = http.GET();

  // if (httpResponseCode > 0) {
  //   Serial.print("HTTP Response code: ");
  //   Serial.println(httpResponseCode);
  //   String payload = http.getString();
  //   Serial.println(payload);
  // } else {
  //   Serial.print("Error code: ");
  //   Serial.println(httpResponseCode);
  // }
  // Free resources
  // http.end();

  // 9600 NMEA is the default baud rate for Adafruit MTK GPS's- some use 4800
  GPS.begin(9600);
  // uncomment this line to turn on RMC (recommended minimum) and GGA (fix data) including altitude
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
  // uncomment this line to turn on only the "minimum recommended" data
  //GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCONLY);
  // For parsing data, we don't suggest using anything but either RMC only or RMC+GGA since
  // the parser doesn't care about other sentences at this time
  // Set the update rate
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);  // 1 Hz update rate
  // For the parsing code to work nicely and have time to sort thru the data, and
  // print it out we don't suggest using anything higher than 1 Hz

  // Request updates on antenna status, comment out to keep quiet
  GPS.sendCommand(PGCMD_ANTENNA);

  delay(1000);

  // Ask for firmware version
  GPSSerial.println(PMTK_Q_RELEASE);
}

void loop()  // run over and over again
{
  // read data from the GPS in the 'main loop'
  char c = GPS.read();
  // if you want to debug, this is a good time to do it!
  if (GPSECHO)
    if (c) Serial.print(c);
  // if a sentence is received, we can check the checksum, parse it...
  if (GPS.newNMEAreceived()) {
    // a tricky thing here is if we print the NMEA sentence, or data
    // we end up not listening and catching other sentences!
    // so be very wary if using OUTPUT_ALLDATA and trying to print out data
    // Serial.print(GPS.lastNMEA());    // this also sets the newNMEAreceived() flag to false
    if (!GPS.parse(GPS.lastNMEA()))  // this also sets the newNMEAreceived() flag to false
      return;                        // we can fail to parse a sentence in which case we should just wait for another
  }

  // approximately every 2 seconds or so, print out the current stats
  if (millis() - timer > 2000) {
    timer = millis();  // reset the timer

    Serial.print("\nTime: ");
    if (GPS.hour < 10) { Serial.print('0'); }
    Serial.print(GPS.hour, DEC);
    Serial.print(':');
    if (GPS.minute < 10) { Serial.print('0'); }
    Serial.print(GPS.minute, DEC);
    Serial.print(':');
    if (GPS.seconds < 10) { Serial.print('0'); }
    Serial.print(GPS.seconds, DEC);
    Serial.print('.');
    if (GPS.milliseconds < 10) {
      Serial.print("00");
    } else if (GPS.milliseconds > 9 && GPS.milliseconds < 100) {
      Serial.print("0");
    }
    Serial.println(GPS.milliseconds);
    Serial.print("Date: ");
    Serial.print(GPS.day, DEC);
    Serial.print('/');
    Serial.print(GPS.month, DEC);
    Serial.print("/20");
    Serial.println(GPS.year, DEC);
    Serial.print("Fix: ");
    Serial.print((int)GPS.fix);
    Serial.print(" quality: ");
    Serial.println((int)GPS.fixquality);
    if (GPS.fix) {
      Serial.print("Location: ");
      Serial.print(GPS.latitude, 8);
      Serial.print(GPS.lat);
      Serial.print(", ");
      Serial.print(GPS.longitude, 8);
      Serial.println(GPS.lon);
      //ETCG Notes -- The Following Gives Coordinates in formant you can plug into
      //Google Maps (Degrees)
      Serial.println("Location in Degrees");
      Serial.print(GPS.latitudeDegrees, 8);
      Serial.print(", ");
      Serial.println(GPS.longitudeDegrees, 8);

      Serial.print("Speed (knots): ");
      Serial.println(GPS.speed);
      Serial.print("Angle: ");
      Serial.println(GPS.angle);
      Serial.print("Altitude: ");
      Serial.println(GPS.altitude);
      Serial.print("Satellites: ");
      Serial.println((int)GPS.satellites);

      http.addHeader("Content-Type", "application/json");

      String time = "";
      if (GPS.hour < 10) { time += '0'; }
      time += GPS.hour;
      time += ':';
      if (GPS.minute < 10) { time += '0'; }
      time += GPS.minute;
      time += ':';
      if (GPS.seconds < 10) { time += '0'; }
      time += GPS.seconds;
      time += '.';
      if (GPS.milliseconds < 10) {
        time += "00";
      } else if (GPS.milliseconds > 9 && GPS.milliseconds < 100) {
        time += "0";
      }
      time += GPS.milliseconds;

      String date = String(GPS.day) + '/' + String(GPS.month) + "/20" + String(GPS.year);
      String jsonDate = "\"date\":\"" + date + "\"";
      String jsonTime = "\"time\":\"" + time + "\"";
      String jsonLatitude = "\"latitude\":\"" + String(GPS.latitudeDegrees, 8) + "\"";
      String jsonLongitude = "\"longitude\":\"" + String(GPS.longitudeDegrees, 8) + "\"";
      String jsonSpeed = "\"speed\":\"" + String(GPS.speed * 1.852, 8) + "\"";
      String jsonData = "{" + jsonDate + ',' + jsonTime + ',' + jsonLatitude + ',' + jsonLongitude + ',' + jsonSpeed + "}";
      int httpResponseCode = http.POST(jsonData);

      // if (httpResponseCode > 0) {
      //   Serial.print("HTTP Response code: ");
      //   Serial.println(httpResponseCode);
      //   String payload = http.getString();
      //   Serial.println(payload);
      // } else {
      //   Serial.print("Error code: ");
      //   Serial.println(httpResponseCode);
      // }
    }
  }
}