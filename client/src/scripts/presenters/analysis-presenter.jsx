class AnalysisPresenter {
  constructor() {
    this.dataService = this.initDataService();
  }

  initDataService() {
    return {
      generateHistoricalData: (timeRange) => {
        const days = this.getTimeRangeDays(timeRange);
        const data = [];

        for (let i = days; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);

          // Generate realistic sensor data
          const soilMoisture = 200 + Math.random() * 600;
          const temperature = 20 + Math.random() * 20;
          const humidity = 40 + Math.random() * 40;

          // Determine watering recommendation based on conditions
          const needsWatering =
            soilMoisture < 350 || (soilMoisture < 450 && temperature > 30);
          const confidence = 70 + Math.random() * 25;

          data.push({
            date: date.toISOString().split("T")[0],
            soilMoisture: Math.round(soilMoisture),
            temperature: Math.round(temperature * 10) / 10,
            humidity: Math.round(humidity),
            recommendation: needsWatering
              ? "WATERING NEEDED"
              : "NO WATERING NEEDED",
            confidence: Math.round(confidence * 10) / 10,
            timestamp: date.getTime(),
          });
        }

        return data;
      },

      generateTrendData: (historicalData) => {
        return {
          moistureTrend: this.calculateTrend(
            historicalData.map((d) => d.soilMoisture)
          ),
          temperatureTrend: this.calculateTrend(
            historicalData.map((d) => d.temperature)
          ),
          humidityTrend: this.calculateTrend(
            historicalData.map((d) => d.humidity)
          ),
          wateringFrequency: this.calculateWateringFrequency(historicalData),
        };
      },

      generateInsights: (historicalData, trendData) => {
        const insights = [];
        const avgMoisture =
          historicalData.reduce((sum, d) => sum + d.soilMoisture, 0) /
          historicalData.length;
        const avgTemp =
          historicalData.reduce((sum, d) => sum + d.temperature, 0) /
          historicalData.length;
        const wateringDays = historicalData.filter(
          (d) => d.recommendation === "WATERING NEEDED"
        ).length;

        // Moisture insights
        if (avgMoisture < 300) {
          insights.push({
            type: "warning",
            title: "Low Soil Moisture",
            message:
              "Your soil moisture levels are consistently low. Consider increasing watering frequency.",
            priority: "high",
          });
        } else if (avgMoisture > 600) {
          insights.push({
            type: "info",
            title: "High Soil Moisture",
            message:
              "Soil moisture levels are high. Monitor for potential overwatering.",
            priority: "medium",
          });
        }

        // Temperature insights
        if (avgTemp > 35) {
          insights.push({
            type: "warning",
            title: "High Temperature Alert",
            message:
              "Temperature levels are high. Plants may need more frequent watering.",
            priority: "high",
          });
        }

        // Watering pattern insights
        const wateringPercentage = (wateringDays / historicalData.length) * 100;
        if (wateringPercentage > 70) {
          insights.push({
            type: "info",
            title: "Frequent Watering Needed",
            message: `${Math.round(
              wateringPercentage
            )}% of days required watering. Consider soil improvement.`,
            priority: "medium",
          });
        }

        // Trend insights
        if (trendData.moistureTrend === "decreasing") {
          insights.push({
            type: "warning",
            title: "Declining Moisture Trend",
            message: "Soil moisture is trending downward. Monitor closely.",
            priority: "medium",
          });
        }

        return insights;
      },
    };
  }

  getTimeRangeDays(timeRange) {
    switch (timeRange) {
      case "7days":
      case "7d":
        return 7;
      case "30days":
      case "30d":
        return 30;
      case "90days":
      case "90d":
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
    const threshold = firstAvg * 0.1; // 10% threshold

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
      percentage: Math.round((wateringDays / data.length) * 100),
      averageInterval: data.length / (wateringDays || 1),
    };
  }

  // New methods for the AnalysisPage
  async getHistoricalData(timeRange = "7days") {
    try {
      return this.dataService.generateHistoricalData(timeRange);
    } catch (error) {
      console.error("Error getting historical data:", error);
      throw error;
    }
  }

  async getTrendData(timeRange = "7days") {
    try {
      const historicalData = this.dataService.generateHistoricalData(timeRange);
      return this.dataService.generateTrendData(historicalData);
    } catch (error) {
      console.error("Error getting trend data:", error);
      throw error;
    }
  }

  async getStatisticsData(timeRange = "7days") {
    try {
      const historicalData = this.dataService.generateHistoricalData(timeRange);
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
    } catch (error) {
      console.error("Error getting statistics data:", error);
      throw error;
    }
  }

  exportAnalysisData(historicalData, timeRange) {
    try {
      const csvData = this.convertToCSV(historicalData);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `plant-analysis-${timeRange}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  }

  async loadAnalysisData(timeRange = "7d") {
    try {
      const historicalData = this.dataService.generateHistoricalData(timeRange);
      const trendData = this.dataService.generateTrendData(historicalData);
      const insights = this.dataService.generateInsights(
        historicalData,
        trendData
      );

      return {
        historical: historicalData,
        trends: trendData,
        insights: insights,
        summary: this.generateSummary(historicalData, trendData, insights),
      };
    } catch (error) {
      console.error("Error loading analysis data:", error);
      throw error;
    }
  }

  generateSummary(historical, trends, insights) {
    const avgMoisture = Math.round(
      historical.reduce((sum, d) => sum + d.soilMoisture, 0) / historical.length
    );
    const avgTemp =
      Math.round(
        (historical.reduce((sum, d) => sum + d.temperature, 0) /
          historical.length) *
          10
      ) / 10;
    const wateringNeeded = historical.filter(
      (d) => d.recommendation === "WATERING NEEDED"
    ).length;

    return {
      averageMoisture: avgMoisture,
      averageTemperature: avgTemp,
      totalWateringDays: wateringNeeded,
      criticalInsights: insights.filter((i) => i.priority === "high").length,
      overallTrend: this.getOverallTrend(trends),
    };
  }

  getOverallTrend(trends) {
    const trendValues = [
      trends.moistureTrend,
      trends.temperatureTrend,
      trends.humidityTrend,
    ];
    const increasing = trendValues.filter((t) => t === "increasing").length;
    const decreasing = trendValues.filter((t) => t === "decreasing").length;

    if (increasing > decreasing) return "improving";
    if (decreasing > increasing) return "declining";
    return "stable";
  }

  formatDataForChart(data, metric) {
    return data.map((item) => ({
      x: item.date,
      y: item[metric],
      label: item.date,
    }));
  }

  convertToCSV(data) {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");

    return `${headers}\n${rows}`;
  }
}

export default AnalysisPresenter;
