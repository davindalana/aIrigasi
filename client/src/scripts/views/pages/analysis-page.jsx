import React, { useState, useEffect } from "react";
import AnalysisPresenter from "../../presenters/analysis-presenter";
import AnalysisTemplate from "../template/analysis-template";

const AnalysisPage = () => {
  const [state, setState] = useState({
    historicalData: [],
    trendData: [],
    statisticsData: {
      totalAnalyses: 0,
      wateringRecommendations: 0,
      averageConfidence: 0,
      optimalMoistureRange: { min: 300, max: 600 },
    },
    selectedTimeRange: "7days",
    isLoading: true,
  });

  const presenter = new AnalysisPresenter();

  useEffect(() => {
    loadAnalysisData();
  }, [state.selectedTimeRange]);

  const loadAnalysisData = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const [historical, trends, statistics] = await Promise.all([
        presenter.getHistoricalData(state.selectedTimeRange),
        presenter.getTrendData(state.selectedTimeRange),
        presenter.getStatisticsData(state.selectedTimeRange),
      ]);

      setState((prev) => ({
        ...prev,
        historicalData: historical,
        trendData: trends,
        statisticsData: statistics,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to load analysis data:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleTimeRangeChange = (timeRange) => {
    setState((prev) => ({
      ...prev,
      selectedTimeRange: timeRange,
    }));
  };

  const handleExportData = () => {
    presenter.exportAnalysisData(state.historicalData, state.selectedTimeRange);
  };

  return (
    <AnalysisTemplate
      historicalData={state.historicalData}
      trendData={state.trendData}
      statisticsData={state.statisticsData}
      selectedTimeRange={state.selectedTimeRange}
      isLoading={state.isLoading}
      onTimeRangeChange={handleTimeRangeChange}
      onExportData={handleExportData}
    />
  );
};

export default AnalysisPage;
