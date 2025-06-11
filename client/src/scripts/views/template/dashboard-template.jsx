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
    if (!recommendation) return "decision-status-default";
    const lowerCaseRec = recommendation.toLowerCase();
    if (lowerCaseRec.includes("tidak perlu siram")) {
      return "decision-status-no-water";
    }
    if (lowerCaseRec.includes("siram sedikit")) {
      return "decision-status-water-low";
    }
    if (lowerCaseRec.includes("siram sedang")) {
      return "decision-status-water-medium";
    }
    if (lowerCaseRec.includes("siram banyak")) {
      return "decision-status-water-high";
    }
    return "decision-status-default";
  };

  const getWateringVolume = (recommendation) => {
    if (!recommendation) return null;
    const lowerCaseRec = recommendation.toLowerCase();
    if (lowerCaseRec.includes("siram sedikit")) {
      return "Rekomendasi Volume: ±200–250 ml";
    }
    if (lowerCaseRec.includes("siram sedang")) {
      return "Rekomendasi Volume: ±400–500 ml";
    }
    if (lowerCaseRec.includes("siram banyak")) {
      return "Rekomendasi Volume: ±600–800 ml";
    }
    if (lowerCaseRec.includes("tidak perlu siram")) {
      return "Tanaman Anda Cukup Air";
    }
    return null;
  };

  const getActionStatus = (recommendation) => {
    if (!recommendation) {
      return { text: "Menunggu", class: "status-waiting" };
    }
    const lowerCaseRec = recommendation.toLowerCase();
    if (lowerCaseRec.includes("waiting")) {
      return { text: "Menunggu", class: "status-waiting" };
    }
    if (lowerCaseRec.includes("tidak perlu siram")) {
      return { text: "Aman", class: "status-safe" };
    }
    if (lowerCaseRec.includes("error")) {
      return { text: "Error", class: "status-error" };
    }
    return { text: "Siram Sekarang", class: "status-needed" };
  };

  const actionStatus = getActionStatus(aiDecision.recommendation);
  const wateringVolumeText = getWateringVolume(aiDecision.recommendation);

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

      <div className="card ai-decision-card">
        <div className="decision-header">
          <div className="decision-icon">🧠</div>
          <div className="decision-content">
            <p className="decision-title">AI Decision</p>
            <h3
              className={`decision-status ${getDecisionClass(
                aiDecision.recommendation
              )}`}
            >
              {aiDecision.recommendation || "Menunggu Analisis..."}
            </h3>
            {wateringVolumeText && (
              <div className="decision-volume-container">
                <p className="decision-volume-info">{wateringVolumeText}</p>
              </div>
            )}
          </div>

          <div className="action-status-container">
            <span className="action-status-label">Tindakan Diperlukan</span>
            <span className={`action-status-indicator ${actionStatus.class}`}>
              {actionStatus.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
