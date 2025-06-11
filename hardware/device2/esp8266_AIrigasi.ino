#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// WiFi credentials
const char* ssid = "Rakha";
const char* password = "**********";

// Server API endpoint
const char* serverName = "https://airigasi-production.up.railway.app/api/sensors";

// DHT setup
#define DHTPIN D7
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Soil_Moisture moisture analog pin
#define Soil_Moisture_PIN A0

// Device ID
String deviceID = "esp8266-AIrigasi-02";

void setup() {
  Serial.begin(115200);
  delay(1000);
  dht.begin();

  Serial.println("[INFO] Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\n[INFO] Connected to WiFi!");
  Serial.print("[INFO] IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float Temperature = dht.readTemperature();
    float Air_Humidity = dht.readHumidity();
    int Soil_Moisture = (1024 - analogRead(Soil_Moisture_PIN));

    Serial.println("---- SENSOR READINGS ----");
    Serial.print("Temperature: ");
    Serial.print(Temperature);
    Serial.println(" °C");

    Serial.print("Air_Humidity: ");
    Serial.print(Air_Humidity);
    Serial.println(" %");

    Serial.print("Soil_Moisture Moisture: ");
    Serial.println(Soil_Moisture);

    if (isnan(Temperature) || isnan(Air_Humidity)) {
      Serial.println("[ERROR] Failed to read from DHT sensor!");
      return;
    }

    StaticJsonDocument<256> jsonDoc;
    jsonDoc["Temperature"] = Temperature;
    jsonDoc["Air_Humidity"] = Air_Humidity;
    jsonDoc["Soil_Moisture"] = Soil_Moisture;
    jsonDoc["device_id"] = deviceID;

    String jsonData;
    serializeJson(jsonDoc, jsonData);

    Serial.println("---- SENDING TO SERVER ----");
    Serial.print("JSON: ");
    Serial.println(jsonData);

    WiFiClientSecure client;
    client.setInsecure(); // ⚠ only for testing

    HTTPClient http;
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.print("[INFO] HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("[INFO] Server response:");
      Serial.println(response);
    } else {
      Serial.print("[ERROR] Failed HTTP POST, code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("[ERROR] WiFi Disconnected");
  }

  delay(10000); // Wait 10 seconds
}