class DashboardPresenter {
  constructor() {
    this.apiUrl = "https://airigasi-production.up.railway.app/api";
  }

  async getLatestSensorData(deviceId) {
    try {
      const response = await fetch(`${this.apiUrl}/sensors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allSensorData = await response.json();

      const deviceData = allSensorData
        .filter((data) => data.device_id === deviceId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      if (deviceData.length > 0) {
        return deviceData[0];
      }
      return { Temperature: 0, Air_Humidity: 0, Soil_Moisture: 0 };
    } catch (error) {
      console.error("Failed to fetch latest sensor data:", error);
      return { Temperature: 0, Air_Humidity: 0, Soil_Moisture: 0 };
    }
  }

  async analyzeIrrigationNeeds(sensorData) {
    try {
      const response = await fetch(`${this.apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sensorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const predictionResult = await response.json();

      return {
        recommendation: predictionResult.message,
        confidence: predictionResult.result === 0 ? 85 : 95,
        modelConfidence: 93.0,
        pumpStatus: predictionResult.result === 0 ? "OFF" : "ON",
      };
    } catch (error) {
      console.error("Analysis request failed:", error);
      return {
        recommendation: "Error: Analysis Failed",
        confidence: 0,
        modelConfidence: 0,
        pumpStatus: "OFF",
      };
    }
  }

  validateSensorData(sensorData) {
    const errors = [];
    if (sensorData.Soil_Moisture < 0 || sensorData.Soil_Moisture > 1023) {
      errors.push("Soil moisture must be between 0-1023");
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default DashboardPresenter;
