// src/scripts/views/template/dashboard-template.jsx
import React from "react";
import "../../../styles/pages/dashboard.css";
import "../../../styles/components/cards.css";
import "../../../styles/components/forms.css";
import "../../../styles/components/buttons.css";
import "../../../styles/components/charts.css";

const DashboardTemplate = ({
  sensorData,
  weatherData,
  aiDecision,
  isLoading,
  onSensorChange,
  onAnalyze,
}) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>AIrigasi</h2>
        <p>AI-Powered Plant Watering Decision System</p>
      </div>

      <div className="card sensor-input-card">
        <div className="card-header">
          📊 <span>Sensor Data Input</span>
        </div>

        <div className="sensor-inputs">
          <div className="input-group">
            <label className="input-label">Soil Moisture (0-1023)</label>
            <input
              type="number"
              className="sensor-input"
              value={sensorData.soilMoisture}
              onChange={(e) =>
                onSensorChange("soilMoisture", parseInt(e.target.value) || 0)
              }
              min="0"
              max="1023"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Temperature (°C)</label>
            <input
              type="number"
              className="sensor-input"
              value={sensorData.temperature}
              onChange={(e) =>
                onSensorChange("temperature", parseInt(e.target.value) || 0)
              }
            />
          </div>

          <div className="input-group">
            <label className="input-label">Air Humidity (%)</label>
            <input
              type="number"
              className="sensor-input"
              value={sensorData.airHumidity}
              onChange={(e) =>
                onSensorChange("airHumidity", parseInt(e.target.value) || 0)
              }
              min="0"
              max="100"
            />
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

      <div className="card ai-decision-card">
        <div className="decision-header">
          <div className="decision-icon">⏸️</div>
          <div className="decision-content">
            <h3
              className={`decision-text ${
                aiDecision.recommendation.includes("NO")
                  ? "no-water"
                  : "water-needed"
              }`}
            >
              {aiDecision.recommendation}
            </h3>
            <p className="decision-subtitle">AI Decision</p>
          </div>
          <div className="confidence-badge">
            <span className="confidence-label">Confidence</span>
            <span className="confidence-value">{aiDecision.confidence}%</span>
          </div>
        </div>

        <div
          className={`confidence-bar ${
            aiDecision.recommendation.includes("NO") ? "orange" : "green"
          }`}
        >
          <div
            className="confidence-fill"
            style={{ width: `${aiDecision.confidence}%` }}
          ></div>
        </div>
      </div>

      <div className="sensor-display">
        <div className="sensor-card">
          <h4>SOIL MOISTURE</h4>
          <div className="sensor-value">{sensorData.soilMoisture}</div>
          <div className="sensor-unit">units</div>
        </div>

        <div className="sensor-card">
          <h4>TEMPERATURE</h4>
          <div className="sensor-value">{sensorData.temperature}.0</div>
          <div className="sensor-unit">°C</div>
        </div>

        <div className="sensor-card">
          <h4>AIR HUMIDITY</h4>
          <div className="sensor-value">{sensorData.airHumidity}.0</div>
          <div className="sensor-unit">%</div>
        </div>

        <div className="sensor-card">
          <h4>MODEL CONFIDENCE</h4>
          <div className="sensor-value">{aiDecision.modelConfidence}</div>
          <div className="sensor-unit">%</div>
        </div>
      </div>

      <div className="card weather-card">
        <div className="card-header">
          🌤️ <span>Weather Conditions</span>
        </div>

        <div className="weather-grid">
          <div className="weather-item">
            <div className="weather-label">Rain Forecast</div>
            <div className="weather-value">{weatherData.rainForecast}</div>
          </div>

          <div className="weather-item">
            <div className="weather-label">Rain Amount</div>
            <div className="weather-value">{weatherData.rainAmount} mm</div>
          </div>

          <div className="weather-item">
            <div className="weather-label">Weather Temp</div>
            <div className="weather-value">{weatherData.weatherTemp}°C</div>
          </div>

          <div className="weather-item">
            <div className="weather-label">Weather Humidity</div>
            <div className="weather-value">{weatherData.weatherHumidity}%</div>
          </div>
        </div>
      </div>

      <div className="card explanation-card">
        <div className="card-header">
          🧠 <span>AI Decision Explanation</span>
        </div>
        <p className="explanation-text">
          Model analysis shows {aiDecision.recommendation.toLowerCase()} with{" "}
          {aiDecision.confidence}% confidence.
          {weatherData.rainForecast === "No"
            ? " No rain expected, maintaining irrigation recommendation."
            : " Rain expected, adjusting recommendation accordingly."}
        </p>
      </div>
    </div>
  );
};

export default DashboardTemplate;
