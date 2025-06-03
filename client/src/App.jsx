import React, { useState } from "react";
import "../src/styles/App.css";
import DashboardPage from "./scripts/views/pages/dashboard-page";
import AnalysisPage from "./scripts/views/pages/analysis-page";
import ReportPage from "./scripts/views/pages/report-page";

function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardPage />;
      case "analysis":
        return <AnalysisPage />;
      case "report":
        return <ReportPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="App">
      {/* App Bar */}
      <header className="app-bar">
        <div className="app-bar-content">
          <div className="app-title">
            <span className="app-icon">🌱</span>
            <h1>Smart Irrigation System</h1>
          </div>
          <nav className="app-nav">
            <button
              className={`nav-button ${
                activeMenu === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`nav-button ${
                activeMenu === "analysis" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("analysis")}
            >
              Analysis
            </button>
            <button
              className={`nav-button ${
                activeMenu === "report" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("report")}
            >
              Report
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
