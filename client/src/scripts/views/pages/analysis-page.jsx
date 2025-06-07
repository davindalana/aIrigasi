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
    selectedDeviceId: "device1",
    isLoading: true,
  });

  const presenter = new AnalysisPresenter();

  useEffect(() => {
    loadAnalysisData();
  }, [state.selectedTimeRange, state.selectedDeviceId]);

  const loadAnalysisData = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const [historical, trends, statistics] = await Promise.all([
        presenter.getHistoricalData(
          state.selectedTimeRange,
          state.selectedDeviceId
        ),
        presenter.getTrendData(state.selectedTimeRange, state.selectedDeviceId),
        presenter.getStatisticsData(
          state.selectedTimeRange,
          state.selectedDeviceId
        ),
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

  const handleDeviceChange = (deviceId) => {
    setState((prev) => ({
      ...prev,
      selectedDeviceId: deviceId,
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
      selectedDeviceId={state.selectedDeviceId}
      isLoading={state.isLoading}
      onTimeRangeChange={handleTimeRangeChange}
      onDeviceChange={handleDeviceChange}
      onExportData={handleExportData}
    />
  );
};

export default AnalysisPage;
