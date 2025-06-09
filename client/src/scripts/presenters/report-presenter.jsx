class SimpleReportPresenter {
  constructor() {
    this.apiUrl = "https://airigasi-production.up.railway.app/api";
  }

  async fetchReportData(dateRange, deviceId) {
    try {
      const response = await fetch(`${this.apiUrl}/sensors`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const allData = await response.json();
      const days = this.getDaysFromRange(dateRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      return allData.filter((d) => {
        const recordDate = new Date(d.timestamp);
        return (
          d.device_id === deviceId &&
          recordDate >= startDate &&
          recordDate <= endDate
        );
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      return [];
    }
  }

  async generateReport(dateRange = "7days", deviceId = "device1") {
    const filteredData = await this.fetchReportData(dateRange, deviceId);

    if (filteredData.length === 0) {
      return null;
    }

    return {
      summary: this.generateSummary(filteredData),
      analytics: this.generateAnalytics(filteredData),
      history: this.generateHistory(filteredData),
    };
  }

  getDaysFromRange(range) {
    switch (range) {
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

  generateSummary(data) {
    const totalAnalyses = data.length;
    const wateringEvents = data.filter((d) => d.Soil_Moisture < 400).length;
    const avgConfidence =
      data.reduce((sum, item) => sum + (item.confidence || 85), 0) /
      data.length;
    const efficiency =
      totalAnalyses > 0
        ? ((totalAnalyses - wateringEvents) / totalAnalyses) * 100
        : 100;
    const latestData = data[data.length - 1] || {};

    return {
      totalAnalyses,
      wateringEvents,
      efficiency: Math.round(efficiency),
      confidence: Math.round(avgConfidence),
      currentConditions: {
        moisture: latestData.Soil_Moisture || 0,
        temperature: latestData.Temperature || 0,
        humidity: latestData.Air_Humidity || 0,
      },
      systemStatus: {
        uptime: 99.5,
        lastAnalysis: this.formatTimeAgo(latestData.timestamp),
        waterSaved: Math.round((totalAnalyses - wateringEvents) * 1.5),
      },
    };
  }

  generateAnalytics(data) {
    const moistureDistribution = this.calculateDistribution(
      data.map((item) => item.Soil_Moisture),
      [0, 300, 600, 1023],
      ["low", "medium", "high"]
    );
    const temperatureDistribution = this.calculateDistribution(
      data.map((item) => item.Temperature),
      [0, 20, 30, 50],
      ["low", "medium", "high"]
    );
    return { moistureDistribution, temperatureDistribution, dailyTrends: [] };
  }

  calculateDistribution(values, thresholds, labels) {
    const distribution = {};
    const total = values.length;
    if (total === 0) return { low: 0, medium: 0, high: 0 };

    labels.forEach((label, index) => {
      const min = thresholds[index];
      const max = thresholds[index + 1];
      const count = values.filter((val) => val >= min && val < max).length;
      distribution[label] = Math.round((count / total) * 100);
    });
    return distribution;
  }

  generateHistory(data) {
    return {
      recentActivities: data
        .slice(-5)
        .reverse()
        .map((item) => ({
          type: item.Soil_Moisture < 400 ? "watering" : "analysis",
          title:
            item.Soil_Moisture < 400
              ? "Watering Completed"
              : "Analysis Completed",
          time: this.formatTimeAgo(item.timestamp),
          description: `Moisture: ${item.Soil_Moisture}, Temp: ${item.Temperature}°C`,
          status: "success",
        })),
    };
  }

  formatTimeAgo(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  }
}

export default SimpleReportPresenter;
