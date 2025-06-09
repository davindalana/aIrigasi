import React, { useState, useEffect } from "react";
import DashboardPresenter from "../../presenters/dashboard-presenter";
import DashboardTemplate from "../template/dashboard-template";

const DashboardPage = () => {
  const [state, setState] = useState({
    sensorData: {
      Soil_Moisture: 0,
      Temperature: 0,
      Air_Humidity: 0,
    },
    // State aiDecision diperbarui
    aiDecision: {
      recommendation: "Waiting for analysis...",
    },
    pumpStatus: "OFF",
    isLoading: true,
    selectedDeviceId: "esp8266-AIrigasi-02",
  });

  const presenter = new DashboardPresenter();

  const deviceIds = [
    "esp8266-AIrigasi-01",
    "esp8266-AIrigasi-02",
    "esp8266-AIrigasi-03",
  ];

  useEffect(() => {
    const loadLatestData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      const latestData = await presenter.getLatestSensorData(
        state.selectedDeviceId
      );
      if (latestData) {
        setState((prev) => ({
          ...prev,
          sensorData: {
            Soil_Moisture: latestData.Soil_Moisture,
            Temperature: latestData.Temperature,
            Air_Humidity: latestData.Air_Humidity,
          },
          aiDecision: {
            recommendation: "Waiting for analysis...",
          },
          pumpStatus: "OFF",
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadLatestData();
  }, [state.selectedDeviceId]);

  const handleAnalyze = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const dataToPredict = {
      ...state.sensorData,
      device_id: state.selectedDeviceId,
      timestamp: new Date().toISOString(),
    };

    const decision = await presenter.analyzeIrrigationNeeds(dataToPredict);

    // Perbarui state dengan keputusan baru, hapus confidence
    setState((prev) => ({
      ...prev,
      aiDecision: {
        recommendation: decision.recommendation,
      },
      pumpStatus: decision.pumpStatus,
      isLoading: false,
    }));
  };

  const handleDeviceChange = (deviceId) => {
    setState((prev) => ({
      ...prev,
      selectedDeviceId: deviceId,
    }));
  };

  const handleSensorChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      sensorData: {
        ...prev.sensorData,
        [field]: value,
      },
    }));
  };

  return (
    <DashboardTemplate
      sensorData={state.sensorData}
      aiDecision={state.aiDecision}
      pumpStatus={state.pumpStatus}
      isLoading={state.isLoading}
      selectedDeviceId={state.selectedDeviceId}
      deviceIds={deviceIds}
      onAnalyze={handleAnalyze}
      onDeviceChange={handleDeviceChange}
      onSensorChange={handleSensorChange}
    />
  );
};

export default DashboardPage;
