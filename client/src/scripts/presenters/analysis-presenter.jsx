class AnalysisPresenter {
  constructor() {
    this.apiUrl = "https://airigasi-production.up.railway.app/api";
  }

  mapApiDataToTemplate(apiData) {
    return {
      date: new Date(apiData.timestamp).toISOString().split("T")[0],
      soilMoisture: apiData.Soil_Moisture,
      temperature: apiData.Temperature,
      humidity: apiData.Air_Humidity,
      recommendation:
        apiData.Soil_Moisture < 400 ? "WATERING NEEDED" : "NO WATERING NEEDED",
      confidence: 80 + Math.random() * 15,
      timestamp: new Date(apiData.timestamp).getTime(),
    };
  }

  async getHistoricalData(timeRange = "7days", deviceId) {
    try {
      const response = await fetch(`${this.apiUrl}/sensors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allData = await response.json();

      const days = this.getTimeRangeDays(timeRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const filteredData = allData
        .filter((d) => {
          const recordDate = new Date(d.timestamp);
          return (
            d.device_id === deviceId &&
            recordDate >= startDate &&
            recordDate <= endDate
          );
        })
        .map(this.mapApiDataToTemplate)
        .sort((a, b) => a.timestamp - b.timestamp);

      return filteredData;
    } catch (error) {
      console.error("Error getting historical data:", error);
      return [];
    }
  }

  async getTrendData(timeRange = "7days", deviceId) {
    const historicalData = await this.getHistoricalData(timeRange, deviceId);
    if (historicalData.length === 0) {
      return {
        moistureTrend: "stable",
        temperatureTrend: "stable",
        humidityTrend: "stable",
        wateringFrequency: { total: 0, percentage: 0, averageInterval: 0 },
      };
    }
    return {
      moistureTrend: this.calculateTrend(
        historicalData.map((d) => d.soilMoisture)
      ),
      temperatureTrend: this.calculateTrend(
        historicalData.map((d) => d.temperature)
      ),
      humidityTrend: this.calculateTrend(historicalData.map((d) => d.humidity)),
      wateringFrequency: this.calculateWateringFrequency(historicalData),
    };
  }

  async getStatisticsData(timeRange = "7days", deviceId) {
    const historicalData = await this.getHistoricalData(timeRange, deviceId);
    if (historicalData.length === 0) {
      return {
        totalAnalyses: 0,
        wateringRecommendations: 0,
        averageConfidence: 0,
        optimalMoistureRange: { min: 300, max: 600 },
      };
    }
    const wateringRecommendations = historicalData.filter(
      (d) => d.recommendation === "WATERING NEEDED"
    ).length;
    const avgConfidence =
      historicalData.reduce((sum, d) => sum + d.confidence, 0) /
      historicalData.length;

    return {
      totalAnalyses: historicalData.length,
      wateringRecommendations,
      averageConfidence: Math.round(avgConfidence * 10) / 10,
      optimalMoistureRange: { min: 300, max: 600 },
    };
  }

  getTimeRangeDays(timeRange) {
    switch (timeRange) {
      case "7days":
        return 7;
      case "30days":
        return 30;
      case "90days":
        return 90;
      default:
        return 7;
    }
  }

  calculateTrend(values) {
    if (values.length < 2) return "stable";
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg =
      firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    const difference = secondAvg - firstAvg;
    const threshold = firstAvg * 0.1;

    if (difference > threshold) return "increasing";
    if (difference < -threshold) return "decreasing";
    return "stable";
  }

  calculateWateringFrequency(data) {
    const wateringDays = data.filter(
      (d) => d.recommendation === "WATERING NEEDED"
    ).length;
    return {
      total: wateringDays,
      percentage: Math.round((wateringDays / data.length) * 100) || 0,
      averageInterval: data.length / (wateringDays || 1),
    };
  }

  exportAnalysisData(historicalData, timeRange) {
    const csvData = this.convertToCSV(historicalData);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plant-analysis-${timeRange}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  convertToCSV(data) {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    return `${headers}\n${rows}`;
  }
}

export default AnalysisPresenter;
