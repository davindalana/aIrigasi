import React, { useState, useEffect } from "react";
import ReportTemplate from "../template/report-template";
import SimpleReportPresenter from "../../presenters/report-presenter";

const SimpleReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("summary");

  const presenter = new SimpleReportPresenter();

  useEffect(() => {
    loadReport();
  }, [dateRange]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const data = await presenter.generateReport(dateRange);
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

  return (
    <ReportTemplate
      reportData={reportData}
      isLoading={isLoading}
      dateRange={dateRange}
      activeTab={activeTab}
      onDateRangeChange={handleDateRangeChange}
      onTabChange={handleTabChange}
      onRefresh={loadReport}
    />
  );
};

export default SimpleReportPage;
