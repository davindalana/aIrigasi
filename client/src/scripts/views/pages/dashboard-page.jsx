import React, { useState, useEffect } from "react";
import DashboardPresenter from "../../presenters/dashboard-presenter";
import DashboardTemplate from "../template/dashboard-template";

const DashboardPage = () => {
  const [state, setState] = useState({
    sensorData: {
      soilMoisture: 450,
      temperature: 28,
      airHumidity: 65,
    },
    weatherData: {
      rainForecast: "No",
      rainAmount: "0.0",
      weatherTemp: "26.1",
      weatherHumidity: "72",
    },
    aiDecision: {
      recommendation: "NO WATERING NEEDED",
      confidence: 83.0,
      modelConfidence: 93.0,
    },
    pumpStatus: "OFF",
    isLoading: false,
    selectedDeviceId: "device1",
  });

  const presenter = new DashboardPresenter();

  useEffect(() => {
    presenter.loadWeatherData(state.selectedDeviceId).then((weather) => {
      setState((prev) => ({
        ...prev,
        weatherData: weather,
      }));
    });

    presenter
      .getPumpStatus(state.sensorData, state.selectedDeviceId)
      .then((pump) => {
        setState((prev) => ({
          ...prev,
          pumpStatus: pump.status,
        }));
      });
  }, [state.selectedDeviceId]);

  const handleSensorChange = (field, value) => {
    const newSensorData = {
      ...state.sensorData,
      [field]: value,
    };

    setState((prev) => ({
      ...prev,
      sensorData: newSensorData,
    }));
  };

  const handleAnalyze = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const [decision, pump] = await Promise.all([
        presenter.analyzeIrrigationNeeds(
          state.sensorData,
          state.weatherData,
          state.selectedDeviceId
        ),
        presenter.getPumpStatus(state.sensorData, state.selectedDeviceId),
      ]);

      setState((prev) => ({
        ...prev,
        aiDecision: decision,
        pumpStatus: pump.status,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Analysis failed:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeviceChange = (deviceId) => {
    setState((prev) => ({
      ...prev,
      selectedDeviceId: deviceId,
      sensorData: {
        soilMoisture: 450,
        temperature: 28,
        airHumidity: 65,
      },
    }));
  };

  return (
    <DashboardTemplate
      sensorData={state.sensorData}
      weatherData={state.weatherData}
      aiDecision={state.aiDecision}
      pumpStatus={state.pumpStatus}
      isLoading={state.isLoading}
      selectedDeviceId={state.selectedDeviceId}
      onSensorChange={handleSensorChange}
      onAnalyze={handleAnalyze}
      onDeviceChange={handleDeviceChange}
    />
  );
};

export default DashboardPage;
