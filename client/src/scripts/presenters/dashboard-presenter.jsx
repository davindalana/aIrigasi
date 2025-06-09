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

      // Objek yang dikembalikan diperbarui, confidence dihapus
      return {
        recommendation: predictionResult.message,
        pumpStatus: predictionResult.result > 0 ? "ON" : "OFF",
      };
    } catch (error) {
      console.error("Analysis request failed:", error);
      // Objek yang dikembalikan diperbarui, confidence dihapus
      return {
        recommendation: "Error: Analysis Failed",
        pumpStatus: "OFF",
      };
    }
  }
}

export default DashboardPresenter;
