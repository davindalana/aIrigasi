import React from "react";

const AnalysisTemplate = ({
  historicalData,
  trendData,
  statisticsData,
  selectedTimeRange,
  isLoading,
  onTimeRangeChange,
  onExportData,
}) => {
  const getTimeRangeLabel = (range) => {
    switch (range) {
      case "7days":
        return "Last 7 Days";
      case "30days":
        return "Last 30 Days";
      case "90days":
        return "Last 90 Days";
      default:
        return "Last 7 Days";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "increasing":
        return "📈";
      case "decreasing":
        return "📉";
      default:
        return "➡️";
    }
  };

  const getTrendClass = (trend) => {
    switch (trend) {
      case "increasing":
        return "trend-up";
      case "decreasing":
        return "trend-down";
      default:
        return "trend-stable";
    }
  };

  const getRecommendationClass = (recommendation) => {
    return recommendation === "WATERING NEEDED"
      ? "recommendation-warning"
      : "recommendation-success";
  };

  if (isLoading) {
    return (
      <div className="analysis-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analysis data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h1>Plant Analysis Dashboard</h1>
        <div className="analysis-controls">
          <div className="time-range-selector">
            <label>Time Range:</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="time-range-select"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
          <button onClick={onExportData} className="export-btn">
            📊 Export Data
          </button>
        </div>
      </div>

      <div className="statistics-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Analyses</h3>
            <p className="stat-number">{statisticsData.totalAnalyses}</p>
            <small>{getTimeRangeLabel(selectedTimeRange)}</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💧</div>
          <div className="stat-content">
            <h3>Watering Recommendations</h3>
            <p className="stat-number">
              {statisticsData.wateringRecommendations}
            </p>
            <small>Days requiring water</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Average Confidence</h3>
            <p className="stat-number">{statisticsData.averageConfidence}%</p>
            <small>Prediction accuracy</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <h3>Optimal Range</h3>
            <p className="stat-number">
              {statisticsData.optimalMoistureRange.min}-
              {statisticsData.optimalMoistureRange.max}
            </p>
            <small>Moisture level</small>
          </div>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-section historical-data">
          <h2>📈 Historical Data</h2>
          <div className="chart-container">
            <div className="chart-placeholder">
              <h3>Soil Moisture Over Time</h3>
              <div className="simple-chart">
                {historicalData.slice(-7).map((data, index) => (
                  <div key={index} className="chart-bar">
                    <div
                      className="bar"
                      style={{
                        height: `${(data.soilMoisture / 800) * 100}%`,
                        backgroundColor:
                          data.soilMoisture < 300
                            ? "#ff6b6b"
                            : data.soilMoisture > 600
                            ? "#4ecdc4"
                            : "#51cf66",
                      }}
                    ></div>
                    <span className="bar-label">{data.date.slice(-2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="data-table-container">
            <h3>Recent Measurements</h3>
            <div className="data-table">
              <div className="table-header">
                <span>Date</span>
                <span>Moisture</span>
                <span>Temp (°C)</span>
                <span>Humidity (%)</span>
                <span>Recommendation</span>
                <span>Confidence</span>
              </div>
              {historicalData
                .slice(-5)
                .reverse()
                .map((data, index) => (
                  <div key={index} className="table-row">
                    <span>{data.date}</span>
                    <span
                      className={
                        data.soilMoisture < 300
                          ? "low-moisture"
                          : data.soilMoisture > 600
                          ? "high-moisture"
                          : "normal-moisture"
                      }
                    >
                      {data.soilMoisture}
                    </span>
                    <span>{data.temperature}°</span>
                    <span>{data.humidity}%</span>
                    <span
                      className={getRecommendationClass(data.recommendation)}
                    >
                      {data.recommendation}
                    </span>
                    <span>{data.confidence}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="analysis-section trend-analysis">
          <h2>📊 Trend Analysis</h2>
          <div className="trend-cards">
            <div className="trend-card">
              <div className="trend-header">
                <h4>💧 Soil Moisture</h4>
                <span
                  className={`trend-indicator ${getTrendClass(
                    trendData.moistureTrend
                  )}`}
                >
                  {getTrendIcon(trendData.moistureTrend)}{" "}
                  {trendData.moistureTrend}
                </span>
              </div>
              <p className="trend-description">
                {trendData.moistureTrend === "increasing"
                  ? "Soil moisture is improving over time"
                  : trendData.moistureTrend === "decreasing"
                  ? "Soil moisture is declining - monitor closely"
                  : "Soil moisture levels are stable"}
              </p>
            </div>

            <div className="trend-card">
              <div className="trend-header">
                <h4>🌡️ Temperature</h4>
                <span
                  className={`trend-indicator ${getTrendClass(
                    trendData.temperatureTrend
                  )}`}
                >
                  {getTrendIcon(trendData.temperatureTrend)}{" "}
                  {trendData.temperatureTrend}
                </span>
              </div>
              <p className="trend-description">
                {trendData.temperatureTrend === "increasing"
                  ? "Temperature is rising - consider more frequent watering"
                  : trendData.temperatureTrend === "decreasing"
                  ? "Temperature is cooling - adjust watering schedule"
                  : "Temperature levels are consistent"}
              </p>
            </div>

            <div className="trend-card">
              <div className="trend-header">
                <h4>💨 Humidity</h4>
                <span
                  className={`trend-indicator ${getTrendClass(
                    trendData.humidityTrend
                  )}`}
                >
                  {getTrendIcon(trendData.humidityTrend)}{" "}
                  {trendData.humidityTrend}
                </span>
              </div>
              <p className="trend-description">
                {trendData.humidityTrend === "increasing"
                  ? "Humidity levels are rising"
                  : trendData.humidityTrend === "decreasing"
                  ? "Humidity is dropping - plants may need more water"
                  : "Humidity levels are stable"}
              </p>
            </div>
          </div>

          <div className="watering-frequency">
            <h3>💧 Watering Frequency Analysis</h3>
            <div className="frequency-stats">
              <div className="frequency-item">
                <strong>Total Watering Days:</strong>{" "}
                {trendData.wateringFrequency.total}
              </div>
              <div className="frequency-item">
                <strong>Percentage:</strong>{" "}
                {trendData.wateringFrequency.percentage}%
              </div>
              <div className="frequency-item">
                <strong>Average Interval:</strong>{" "}
                {Math.round(trendData.wateringFrequency.averageInterval)} days
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h2>💡 Smart Insights</h2>
        <div className="insights-grid">
          {historicalData.length > 0 ? (
            <>
              <div className="insight-card">
                <div className="insight-icon">🌱</div>
                <div className="insight-content">
                  <h4>Plant Health Status</h4>
                  <p>
                    Based on recent data, your plant's soil moisture average is{" "}
                    <strong>
                      {Math.round(
                        historicalData.reduce(
                          (sum, d) => sum + d.soilMoisture,
                          0
                        ) / historicalData.length
                      )}
                    </strong>
                    . This is{" "}
                    {Math.round(
                      historicalData.reduce(
                        (sum, d) => sum + d.soilMoisture,
                        0
                      ) / historicalData.length
                    ) < 300
                      ? "below optimal range - consider more frequent watering"
                      : Math.round(
                          historicalData.reduce(
                            (sum, d) => sum + d.soilMoisture,
                            0
                          ) / historicalData.length
                        ) > 600
                      ? "above optimal range - reduce watering frequency"
                      : "within the optimal range"}
                    .
                  </p>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">🌡️</div>
                <div className="insight-content">
                  <h4>Temperature Impact</h4>
                  <p>
                    Average temperature is{" "}
                    <strong>
                      {Math.round(
                        (historicalData.reduce(
                          (sum, d) => sum + d.temperature,
                          0
                        ) /
                          historicalData.length) *
                          10
                      ) / 10}
                      °C
                    </strong>
                    .{" "}
                    {Math.round(
                      historicalData.reduce(
                        (sum, d) => sum + d.temperature,
                        0
                      ) / historicalData.length
                    ) > 30
                      ? "High temperatures detected - your plant may need more frequent watering."
                      : "Temperature conditions are favorable for plant growth."}
                  </p>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">💧</div>
                <div className="insight-content">
                  <h4>Watering Pattern</h4>
                  <p>
                    You needed to water your plant{" "}
                    <strong>
                      {
                        historicalData.filter(
                          (d) => d.recommendation === "WATERING NEEDED"
                        ).length
                      }
                    </strong>{" "}
                    out of {historicalData.length} days (
                    {Math.round(
                      (historicalData.filter(
                        (d) => d.recommendation === "WATERING NEEDED"
                      ).length /
                        historicalData.length) *
                        100
                    )}
                    % ). This indicates{" "}
                    {historicalData.filter(
                      (d) => d.recommendation === "WATERING NEEDED"
                    ).length /
                      historicalData.length >
                    0.7
                      ? "frequent watering needs - consider soil improvement or larger pot"
                      : "a healthy watering schedule"}
                    .
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <h4>No Data Available</h4>
                <p>
                  Start monitoring your plant to generate insights and
                  recommendations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisTemplate;
