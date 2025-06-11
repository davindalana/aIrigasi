// src/scripts/views/pages/report-page.jsx

import React, { useState, useEffect } from "react";
import ReportTemplate from "../template/report-template";
import SimpleReportPresenter from "../../presenters/report-presenter";

const SimpleReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    "esp8266-AIrigasi-02"
  );

  const presenter = new SimpleReportPresenter();

  const deviceIds = [
    "esp8266-AIrigasi-01",
    "esp8266-AIrigasi-02",
    "esp8266-AIrigasi-03",
  ];

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const data = await presenter.generateReport(dateRange, selectedDeviceId);
      setReportData(data);
    } catch (error) {
      console.error("Error loading report:", error);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [dateRange, selectedDeviceId]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDeviceChange = (deviceId) => {
    setSelectedDeviceId(deviceId);
  };

  const handleExportPDF = () => {
    presenter.exportReportAsPDF(reportData, selectedDeviceId, dateRange);
  };

  return (
    <ReportTemplate
      reportData={reportData}
      isLoading={isLoading}
      dateRange={dateRange}
      activeTab={activeTab}
      selectedDeviceId={selectedDeviceId}
      deviceIds={deviceIds}
      onDateRangeChange={handleDateRangeChange}
      onTabChange={handleTabChange}
      onDeviceChange={handleDeviceChange}
      onRefresh={loadReport}
      onExportPDF={handleExportPDF}
    />
  );
};

export default SimpleReportPage;
