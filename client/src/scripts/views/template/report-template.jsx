import React from "react";
import "../../../styles/pages/report.css";
import "../../../styles/components/buttons.css";
import "../../../styles/components/cards.css";
import "../../../styles/components/charts.css";
import "../../../styles/components/navigation.css";
import "../../../styles/components/tables.css";
import "../../../styles/components/timeline.css";
import "../../../styles/components/loading.css";

const ReportTemplate = ({
  reportData,
  isLoading,
  dateRange,
  activeTab,
  selectedDeviceId,
  deviceIds,
  onDateRangeChange,
  onTabChange,
  onDeviceChange,
  onRefresh,
  onExportPDF,
}) => {
  if (isLoading) {
    return (
      <div className="report-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Generating Report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="report-container">
        <div className="loading-container">
          <p>No data available for the selected device and date range.</p>
          <button
            className="btn btn-primary"
            onClick={onRefresh}
            style={{ marginTop: "1rem" }}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📊 System Report</h1>
            <p>Smart Irrigation Analytics</p>
          </div>
          <div className="header-actions">
            <select
              className="date-select"
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
            <select
              className="date-select"
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <button className="btn btn-secondary" onClick={onExportPDF}>
              📄 Export PDF
            </button>
            <button className="btn btn-primary" onClick={onRefresh}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="report-nav">
        <button
          className={`nav-tab ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => onTabChange("summary")}
        >
          📈 Summary
        </button>
        <button
          className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => onTabChange("history")}
        >
          📋 History
        </button>
      </div>

      <div className="report-content">
        {activeTab === "summary" && <SummaryTab data={reportData.summary} />}
        {activeTab === "history" && <HistoryTab data={reportData.history} />}
      </div>
    </div>
  );
};

const SummaryTab = ({ data }) => (
  <div className="summary-tab">
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-icon">🔍</div>
        <div className="metric-content">
          <div className="metric-value">{data.totalAnalyses}</div>
          <div className="metric-label">Total Analyses</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">💧</div>
        <div className="metric-content">
          <div className="metric-value">{data.wateringEvents}</div>
          <div className="metric-label">Watering Events</div>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <span>🌡️ Current Conditions</span>
      </div>
      <div className="conditions-grid">
        <div className="condition-item">
          <span className="condition-label">Soil Moisture</span>
          <span className="condition-value">
            {data.currentConditions.moisture}
          </span>
          <span className="condition-unit">units</span>
        </div>
        <div className="condition-item">
          <span className="condition-label">Temperature</span>
          <span className="condition-value">
            {data.currentConditions.temperature}
          </span>
          <span className="condition-unit">°C</span>
        </div>
        <div className="condition-item">
          <span className="condition-label">Humidity</span>
          <span className="condition-value">
            {data.currentConditions.humidity}
          </span>
          <span className="condition-unit">%</span>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <span>⚙️ System Status</span>
      </div>
      <div className="status-grid">
        <div className="status-item">
          <span className="status-label">System Uptime</span>
          <span
            className={`status-badge ${
              data.systemStatus.uptime > 95 ? "success" : "warning"
            }`}
          >
            {data.systemStatus.uptime}%
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Last Analysis</span>
          <span className="status-value">{data.systemStatus.lastAnalysis}</span>
        </div>
      </div>
    </div>
  </div>
);

const HistoryTab = ({ data }) => (
  <div className="history-tab">
    <div className="card">
      <div className="card-header">
        <span>📋 Recent Activities</span>
      </div>
      <div className="events-table">
        <div className="table-header">
          <span className="table-cell">Waktu</span>
          <span className="table-cell">Tipe</span>
          <span className="table-cell">Deskripsi</span>
          <span className="table-cell">Status</span>
        </div>
        {data.recentActivities.map((activity, index) => (
          <div key={index} className="table-row">
            <span className="table-cell">{activity.time}</span>
            <span className="table-cell">
              <span className={`event-type ${activity.type}`}>
                {activity.type}
              </span>
            </span>
            <span className="table-cell">{activity.description}</span>
            <span className="table-cell">
              <span className={`status ${activity.status}`}>
                {activity.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ReportTemplate;
