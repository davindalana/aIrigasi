import React from "react";
import "../../../styles/pages/dashboard.css";
import "../../../styles/components/cards.css";
import "../../../styles/components/forms.css";
import "../../../styles/components/buttons.css";
import "../../../styles/components/charts.css";

const DashboardTemplate = ({
  sensorData,
  aiDecision,
  pumpStatus,
  isLoading,
  selectedDeviceId,
  deviceIds,
  onSensorChange,
  onAnalyze,
  onDeviceChange,
}) => {
  const pumpStatusClass = pumpStatus === "ON" ? "pump-on" : "pump-off";
  const pumpStatusText = pumpStatus === "ON" ? "Pump ON" : "Pump OFF";

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>AIrigasi</h2>
        <p>AI-Powered Plant Watering Decision System</p>
      </div>

      <div className="card sensor-input-card">
        <div className="card-header">
          🆔 <span>Select Device</span>
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

      <div className="card sensor-input-card">
        <div className="card-header">
          📊 <span>Sensor Data (Real-time)</span>
        </div>

        <div className="sensor-inputs">
          <div className="input-group">
            <label className="input-label">Soil Moisture (0-1023)</label>
            <input
              type="number"
              className="sensor-input"
              value={sensorData.Soil_Moisture}
              onChange={(e) =>
                onSensorChange("Soil_Moisture", parseInt(e.target.value) || 0)
              }
              min="0"
              max="1023"
              readOnly
            />
          </div>

          <div className="input-group">
            <label className="input-label">Temperature (°C)</label>
            <input
              type="number"
              className="sensor-input"
              value={sensorData.Temperature}
              onChange={(e) =>
                onSensorChange("Temperature", parseInt(e.target.value) || 0)
              }
              readOnly
            />
          </div>

          <div className="input-group">
            <label className="input-label">Air Humidity (%)</label>
            <input
              type="number"
              className="sensor-input"
              value={sensorData.Air_Humidity}
              onChange={(e) =>
                onSensorChange("Air_Humidity", parseInt(e.target.value) || 0)
              }
              min="0"
              max="100"
              readOnly
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
          <div className="decision-icon">🧠</div>
          <div className="decision-content">
            <h3
              className={`decision-text ${
                aiDecision.recommendation?.includes("Tidak")
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
            aiDecision.recommendation?.includes("Tidak") ? "orange" : "green"
          }`}
        >
          <div
            className="confidence-fill"
            style={{ width: `${aiDecision.confidence}%` }}
          ></div>
        </div>
      </div>

      <div className="sensor-display">
        <div className={`sensor-card ${pumpStatusClass}`}>
          <h4>WATER PUMP</h4>
          <div className="sensor-value">
            <span className={`pump-status-dot ${pumpStatusClass}`}></span>{" "}
            {pumpStatusText}
          </div>
          <div className="sensor-unit">Status</div>
        </div>

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

        <div className="sensor-card">
          <h4>MODEL CONFIDENCE</h4>
          <div className="sensor-value">{aiDecision.modelConfidence}</div>
          <div className="sensor-unit">%</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
