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
    isLoading: false,
  });

  const presenter = new DashboardPresenter();

  useEffect(() => {
    // Initialize weather data
    presenter.loadWeatherData().then((weather) => {
      setState((prev) => ({
        ...prev,
        weatherData: weather,
      }));
    });
  }, []);

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
      const decision = await presenter.analyzeIrrigationNeeds(
        state.sensorData,
        state.weatherData
      );

      setState((prev) => ({
        ...prev,
        aiDecision: decision,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Analysis failed:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <DashboardTemplate
      sensorData={state.sensorData}
      weatherData={state.weatherData}
      aiDecision={state.aiDecision}
      isLoading={state.isLoading}
      onSensorChange={handleSensorChange}
      onAnalyze={handleAnalyze}
    />
  );
};

export default DashboardPage;
