class DashboardPresenter {
  constructor() {
    this.weatherService = this.initWeatherService();
    this.aiModel = this.initAIModel();
  }

  initWeatherService() {
    // Mock weather service
    return {
      getCurrentWeather: () => ({
        rainForecast: Math.random() > 0.7 ? "Yes" : "No",
        rainAmount: (Math.random() * 5).toFixed(1),
        weatherTemp: (25 + Math.random() * 10).toFixed(1),
        weatherHumidity: (60 + Math.random() * 30).toFixed(0),
      }),
    };
  }

  initAIModel() {
    return {
      predict: (sensorData, weatherData) => {
        const { soilMoisture, temperature, airHumidity } = sensorData;

        // AI Decision Logic
        let needsWatering = false;
        let confidence = 0;
        let modelConfidence = 90 + Math.random() * 8;

        // Primary factors
        if (soilMoisture < 300) {
          needsWatering = true;
          confidence = 85 + Math.random() * 10;
        } else if (soilMoisture < 400) {
          if (temperature > 30 || airHumidity < 50) {
            needsWatering = true;
            confidence = 70 + Math.random() * 15;
          } else {
            confidence = 75 + Math.random() * 15;
          }
        } else if (soilMoisture > 600) {
          confidence = 90 + Math.random() * 8;
        } else {
          confidence = 80 + Math.random() * 15;
        }

        // Weather adjustments
        if (weatherData.rainForecast === "Yes") {
          needsWatering = false;
          confidence = Math.min(confidence + 10, 95);
        }

        return {
          recommendation: needsWatering
            ? "WATERING NEEDED"
            : "NO WATERING NEEDED",
          confidence: Math.round(confidence * 10) / 10,
          modelConfidence: Math.round(modelConfidence * 10) / 10,
        };
      },
    };
  }

  async loadWeatherData() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.weatherService.getCurrentWeather());
      }, 500);
    });
  }

  async analyzeIrrigationNeeds(sensorData, weatherData) {
    // Simulate processing time
    return new Promise((resolve) => {
      setTimeout(() => {
        const decision = this.aiModel.predict(sensorData, weatherData);
        resolve(decision);
      }, 1000);
    });
  }

  validateSensorData(sensorData) {
    const errors = [];

    if (sensorData.soilMoisture < 0 || sensorData.soilMoisture > 1023) {
      errors.push("Soil moisture must be between 0-1023");
    }

    if (sensorData.temperature < -40 || sensorData.temperature > 80) {
      errors.push("Temperature must be between -40°C to 80°C");
    }

    if (sensorData.airHumidity < 0 || sensorData.airHumidity > 100) {
      errors.push("Air humidity must be between 0-100%");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getRecommendationColor(recommendation) {
    return recommendation.includes("NO") ? "orange" : "green";
  }

  getConfidenceLevel(confidence) {
    if (confidence >= 90) return "Very High";
    if (confidence >= 80) return "High";
    if (confidence >= 70) return "Medium";
    if (confidence >= 60) return "Low";
    return "Very Low";
  }

  formatSensorValue(value, type) {
    switch (type) {
      case "temperature":
        return `${value}.0°C`;
      case "humidity":
        return `${value}.0%`;
      case "moisture":
        return `${value} units`;
      default:
        return value;
    }
  }
}

export default DashboardPresenter;
