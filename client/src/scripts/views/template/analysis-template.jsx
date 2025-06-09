import React, { useEffect, useRef } from "react";
import "../../../styles/pages/analysis.css";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js/auto";

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const AnalysisTemplate = ({
  historicalData,
  trendData,
  statisticsData,
  selectedTimeRange,
  selectedDeviceId,
  deviceIds,
  isLoading,
  onTimeRangeChange,
  onDeviceChange,
}) => {
  const moistureChartRef = useRef(null);
  const temperatureChartRef = useRef(null);
  const humidityChartRef = useRef(null);
  const wateringChartRef = useRef(null);

  const destroyChart = (chartRef) => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };

  useEffect(() => {
    if (historicalData && historicalData.length > 0 && !isLoading) {
      destroyChart(moistureChartRef);
      destroyChart(temperatureChartRef);
      destroyChart(humidityChartRef);
      destroyChart(wateringChartRef);

      const dates = historicalData.map((data) =>
        new Date(data.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        })
      );

      const moistureCtx = document.getElementById("moistureChart");
      if (moistureCtx) {
        moistureChartRef.current = new Chart(moistureCtx, {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Soil Moisture",
                data: historicalData.map((data) => data.soilMoisture),
                borderColor: "#4caf50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Moisture Units (0-1023)",
                },
                min: 0,
                max: 1200,
                ticks: {
                  stepSize: 200,
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Moisture: ${context.raw} units`;
                  },
                },
              },
            },
          },
        });
      }

      const temperatureCtx = document.getElementById("temperatureChart");
      if (temperatureCtx) {
        temperatureChartRef.current = new Chart(temperatureCtx, {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Temperature",
                data: historicalData.map((data) => data.temperature),
                borderColor: "#ff9800",
                backgroundColor: "rgba(255, 152, 0, 0.2)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: "Temperature (°C)",
                },
                min: 10,
                max: 40,
                ticks: {
                  stepSize: 5,
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Temperature: ${context.raw}°C`;
                  },
                },
              },
            },
          },
        });
      }

      const humidityCtx = document.getElementById("humidityChart");
      if (humidityCtx) {
        humidityChartRef.current = new Chart(humidityCtx, {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Air Humidity",
                data: historicalData.map((data) => data.humidity),
                borderColor: "#2196f3",
                backgroundColor: "rgba(33, 150, 243, 0.2)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Humidity (%)",
                },
                max: 100,
              },
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Humidity: ${context.raw}%`;
                  },
                },
              },
            },
          },
        });
      }

      const wateringCtx = document.getElementById("wateringChart");
      if (wateringCtx) {
        wateringChartRef.current = new Chart(wateringCtx, {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Watering Level",
                data: historicalData.map((data) => data.recommendationLevel),
                borderColor: "#9c27b0",
                backgroundColor: "rgba(156, 39, 176, 0.2)",
                stepped: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 3.5,
                ticks: {
                  callback: function (value) {
                    const labels = ["No Water", "Low", "Medium", "High"];
                    return labels[value] || "";
                  },
                  stepSize: 1,
                },
                title: {
                  display: true,
                  text: "Watering Level",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const labels = [
                      "Tidak perlu siram",
                      "Siram Sedikit",
                      "Siram Sedang",
                      "Siram Banyak",
                    ];
                    return `Watering: ${labels[context.raw] || "Unknown"}`;
                  },
                },
              },
            },
          },
        });
      }
    }

    return () => {
      destroyChart(moistureChartRef);
      destroyChart(temperatureChartRef);
      destroyChart(humidityChartRef);
      destroyChart(wateringChartRef);
    };
  }, [historicalData, isLoading, selectedTimeRange, selectedDeviceId]);

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
    if (recommendation.includes("Banyak")) return "recommendation-banyak";
    if (recommendation.includes("Sedang")) return "recommendation-sedang";
    if (recommendation.includes("Sedikit")) return "recommendation-sedikit";
    return "recommendation-aman";
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
            <label>Device ID:</label>
            <select
              value={selectedDeviceId}
              onChange={(e) => onDeviceChange(e.target.value)}
              className="time-range-select device-select"
            >
              {deviceIds &&
                deviceIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
            </select>
          </div>

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
      </div>

      <div className="analysis-grid">
        <div className="analysis-section historical-data">
          <h2>📈 Historical Data</h2>
          <div className="chart-container">
            <div className="chart-placeholder">
              <h3>Soil Moisture Over Time</h3>
              <div className="chart-wrapper">
                <canvas id="moistureChart"></canvas>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-placeholder">
              <h3>Temperature Over Time</h3>
              <div className="chart-wrapper">
                <canvas id="temperatureChart"></canvas>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-placeholder">
              <h3>Air Humidity Over Time</h3>
              <div className="chart-wrapper">
                <canvas id="humidityChart"></canvas>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-placeholder">
              <h3>Daily Watering Status</h3>
              <div className="chart-wrapper">
                <canvas id="wateringChart"></canvas>
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
              </div>
              {historicalData &&
                historicalData
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
                {trendData.wateringFrequency?.total}
              </div>
              <div className="frequency-item">
                <strong>Percentage:</strong>{" "}
                {trendData.wateringFrequency?.percentage}%
              </div>
              <div className="frequency-item">
                <strong>Average Interval:</strong>{" "}
                {Math.round(trendData.wateringFrequency?.averageInterval)} days
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h2>💡 Smart Insights</h2>
        <div className="insights-grid">
          {historicalData && historicalData.length > 0 ? (
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
                        historicalData.filter((d) => d.recommendationLevel > 0)
                          .length
                      }
                    </strong>{" "}
                    out of {historicalData.length} days (
                    {Math.round(
                      (historicalData.filter((d) => d.recommendationLevel > 0)
                        .length /
                        historicalData.length) *
                        100
                    )}
                    % ). This indicates{" "}
                    {historicalData.filter((d) => d.recommendationLevel > 0)
                      .length /
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
