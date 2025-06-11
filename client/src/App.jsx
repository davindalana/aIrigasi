// src/App.jsx
import React, { useState } from "react";
import "./styles/components/buttons.css";
import "./styles/components/cards.css";
import "./styles/components/charts.css";
import "./styles/components/forms.css";
import "./styles/components/loading.css";
import "./styles/components/navigation.css";
import "./styles/components/tables.css";
import "./styles/components/timeline.css";
import "./styles/pages/dashboard.css";
import "./styles/pages/analysis.css";
import "./styles/pages/report.css";
import "./styles/App.css";
import DashboardPage from "./scripts/views/pages/dashboard-page";
import AnalysisPage from "./scripts/views/pages/analysis-page";
import ReportPage from "./scripts/views/pages/report-page";
import logoSrc from "./assets/Logo.svg";

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
      <header className="app-bar">
        <div className="app-bar-content">
          <div className="app-title">
            <img
              src={logoSrc}
              alt="AIrigasi Logo"
              className="app-icon"
              width="60px"
            />
            <h1>AIrigasi</h1>
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

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
