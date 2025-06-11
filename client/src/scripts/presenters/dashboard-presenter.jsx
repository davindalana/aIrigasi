class DashboardPresenter {
  constructor() {
    this.apiUrl = "https://airigasi-production.up.railway.app/api";
    // URL API Cuaca ditambahkan di sini
    this.weatherApiUrl =
      "https://api.openweathermap.org/data/2.5/forecast?q=Malang&appid=1abea4adf5a8e3217023e324e339b83e&units=metric";
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
        pumpStatus: predictionResult.result > 0 ? "ON" : "OFF",
      };
    } catch (error) {
      console.error("Analysis request failed:", error);
      return {
        recommendation: "Error: Analysis Failed",
        pumpStatus: "OFF",
      };
    }
  }

  // Fungsi baru untuk mengambil data cuaca
  async getWeatherData() {
    try {
      const response = await fetch(this.weatherApiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const weatherData = await response.json();

      // Mengambil data prakiraan pertama (3 jam ke depan)
      const forecast = weatherData.list[0];
      if (forecast) {
        return {
          temp: forecast.main.temp,
          humidity: forecast.main.humidity,
          description: forecast.weather[0].description,
          rain: forecast.rain ? forecast.rain["3h"] : 0, // Mengambil data hujan, jika ada
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return null;
    }
  }
}

export default DashboardPresenter;
