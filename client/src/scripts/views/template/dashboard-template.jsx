// src/scripts/views/template/dashboard-template.jsx

import React from "react";
import "../../../styles/pages/dashboard.css";
import "../../../styles/components/cards.css";
import "../../../styles/components/forms.css";
import "../../../styles/components/buttons.css";
import "../../../styles/components/charts.css";

const DashboardTemplate = ({
  sensorData,
  aiDecision,
  weatherData,
  isLoading,
  selectedDeviceId,
  deviceIds,
  onAnalyze,
  onDeviceChange,
}) => {
  const getDecisionClass = (recommendation) => {
    if (!recommendation) return "decision-text-default";
    if (recommendation.includes("Tidak perlu siram")) {
      return "decision-text-no-water";
    }
    if (recommendation.includes("Siram Sedikit")) {
      return "decision-text-water-low";
    }
    if (recommendation.includes("Siram Sedang")) {
      return "decision-text-water-medium";
    }
    if (recommendation.includes("Siram Banyak")) {
      return "decision-text-water-high";
    }
    return "decision-text-default";
  };

  const getWeatherIcon = (description) => {
    if (!description) return "❓";
    const desc = description.toLowerCase();
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("drizzle")) return "💧";
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("clouds")) return "☁️";
    if (desc.includes("thunderstorm")) return "⛈️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
    return "❓";
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>AIrigasi</h2>
        <p>AI-Powered Plant Watering Decision System</p>
      </div>

      <div className="card sensor-input-card">
        <div className="card-header">
          <span>🆔 Select Device</span>
        </div>
        <div className="input-group">
          <label className="input-label">Device ID</label>
          <select
            className="sensor-input device-select"
            value={selectedDeviceId}
            onChange={(e) => onDeviceChange(e.target.value)}
          >
            {deviceIds &&
              deviceIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* KARTU PRAKIRAAN CUACA (DIPINDAHKAN KE SINI) */}
      <div className="card weather-card">
        <div className="card-header">
          <span>🌦️ Prakiraan Cuaca (3 Jam ke Depan)</span>
        </div>
        {weatherData ? (
          <div className="weather-grid">
            <div className="weather-item">
              <span className="weather-label">Kondisi</span>
              <span className="weather-value">
                {getWeatherIcon(weatherData.description)}{" "}
                {weatherData.description}
              </span>
            </div>
            <div className="weather-item">
              <span className="weather-label">Temperatur</span>
              <span className="weather-value">
                {Math.round(weatherData.temp)}°C
              </span>
            </div>
            <div className="weather-item">
              <span className="weather-label">Kelembapan</span>
              <span className="weather-value">{weatherData.humidity}%</span>
            </div>
            <div className="weather-item">
              <span className="weather-label">Curah Hujan (3j)</span>
              <span className="weather-value">{weatherData.rain} mm</span>
            </div>
          </div>
        ) : (
          <p>Memuat data cuaca...</p>
        )}
      </div>

      <div className="card sensor-input-card">
        <div className="card-header">
          <span>📊 Sensor Data (Real-time)</span>
        </div>

        {/* INPUT SENSOR DIUBAH MENJADI SENSOR CARD */}
        <div className="sensor-display">
          <div className="sensor-card">
            <h4>SOIL MOISTURE</h4>
            <div className="sensor-value">{sensorData.Soil_Moisture}</div>
            <div className="sensor-unit">units</div>
          </div>

          <div className="sensor-card">
            <h4>TEMPERATURE</h4>
            <div className="sensor-value">{sensorData.Temperature}</div>
            <div className="sensor-unit">°C</div>
          </div>

          <div className="sensor-card">
            <h4>AIR HUMIDITY</h4>
            <div className="sensor-value">{sensorData.Air_Humidity}</div>
            <div className="sensor-unit">%</div>
          </div>
        </div>

        <button
          className={`analyze-btn ${isLoading ? "loading" : ""}`}
          onClick={onAnalyze}
          disabled={isLoading}
        >
          {isLoading ? "🔄 Analyzing..." : "🔍 Analyze & Get Recommendation"}
        </button>
      </div>

      {/* KARTU KEPUTUSAN AI */}
      <div className="card ai-decision-card">
        <div className="decision-header">
          <div className="decision-icon">🧠</div>
          <div className="decision-content">
            <h3
              className={`decision-text ${getDecisionClass(
                aiDecision.recommendation
              )}`}
            >
              {aiDecision.recommendation}
            </h3>
            <p className="decision-subtitle">AI Decision</p>
          </div>

          {/* === PUMP STATUS DISPLAY ADDED HERE === */}
          <div className="pump-status-container">
            <span className="pump-status-label">Pump Status</span>
            <span
              className={`pump-status-indicator pump-status-${aiDecision.pumpStatus?.toLowerCase()}`}
            >
              {aiDecision.pumpStatus}
            </span>
          </div>
          {/* ======================================= */}
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
