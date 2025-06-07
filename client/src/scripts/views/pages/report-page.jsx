import React, { useState, useEffect } from "react";
import ReportTemplate from "../template/report-template";
import SimpleReportPresenter from "../../presenters/report-presenter";

const SimpleReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedDeviceId, setSelectedDeviceId] = useState("device1");

  const presenter = new SimpleReportPresenter();

  useEffect(() => {
    loadReport();
  }, [dateRange, selectedDeviceId]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const data = await presenter.generateReport(dateRange, selectedDeviceId);
      setReportData(data);
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDeviceChange = (deviceId) => {
    setSelectedDeviceId(deviceId);
  };

  return (
    <ReportTemplate
      reportData={reportData}
      isLoading={isLoading}
      dateRange={dateRange}
      activeTab={activeTab}
      selectedDeviceId={selectedDeviceId}
      onDateRangeChange={handleDateRangeChange}
      onTabChange={handleTabChange}
      onDeviceChange={handleDeviceChange}
      onRefresh={loadReport}
    />
  );
};

export default SimpleReportPage;
