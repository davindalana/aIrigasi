import React, { useState, useEffect } from "react";
import AnalysisPresenter from "../../presenters/analysis-presenter";
import AnalysisTemplate from "../template/analysis-template";

const AnalysisPage = () => {
  const [state, setState] = useState({
    historicalData: [],
    trendData: {},
    statisticsData: {
      totalAnalyses: 0,
      wateringRecommendations: 0,
      averageConfidence: 0,
      optimalMoistureRange: { min: 300, max: 600 },
    },
    selectedTimeRange: "7days",
    selectedDeviceId: "esp8266-AIrigasi-02",
    isLoading: true,
  });

  const presenter = new AnalysisPresenter();

  const deviceIds = [
    "esp8266-AIrigasi-01",
    "esp8266-AIrigasi-02",
    "esp8266-AIrigasi-03",
  ];

  useEffect(() => {
    const loadAnalysisData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const [historical, trends, statistics] = await Promise.all([
          presenter.getHistoricalData(
            state.selectedTimeRange,
            state.selectedDeviceId
          ),
          presenter.getTrendData(
            state.selectedTimeRange,
            state.selectedDeviceId
          ),
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

    loadAnalysisData();
  }, [state.selectedTimeRange, state.selectedDeviceId]);

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
      deviceIds={deviceIds}
      isLoading={state.isLoading}
      onTimeRangeChange={handleTimeRangeChange}
      onDeviceChange={handleDeviceChange}
      onExportData={handleExportData}
    />
  );
};

export default AnalysisPage;
