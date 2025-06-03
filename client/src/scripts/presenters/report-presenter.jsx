class SimpleReportPresenter {
  constructor() {
    this.mockData = this.generateMockData();
  }

  // Generate mock data for demonstration
  generateMockData() {
    const data = [];
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const moisture = 200 + Math.random() * 600;
      const temperature = 20 + Math.random() * 15;
      const humidity = 40 + Math.random() * 40;
      const needsWatering = moisture < 350;

      data.push({
        date: date.toISOString().split("T")[0],
        time: date.toTimeString().split(" ")[0],
        moisture: Math.round(moisture),
        temperature: Math.round(temperature * 10) / 10,
        humidity: Math.round(humidity),
        watering: needsWatering,
        confidence: 80 + Math.random() * 15,
        type: needsWatering ? "watering" : "analysis",
        status: "success",
      });
    }

    return data;
  }

  // Main method to generate report
  async generateReport(dateRange = "7days") {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const days = this.getDaysFromRange(dateRange);
    const filteredData = this.mockData.slice(-days);

    return {
      period: {
        range: dateRange,
        startDate: filteredData[0]?.date || "",
        endDate: filteredData[filteredData.length - 1]?.date || "",
        days: days,
      },
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
    const wateringEvents = data.filter((item) => item.watering).length;
    const avgConfidence =
      data.reduce((sum, item) => sum + item.confidence, 0) / data.length;
    const efficiency =
      wateringEvents > 0 ? (wateringEvents / totalAnalyses) * 100 : 100;

    const latestData = data[data.length - 1] || {};

    return {
      totalAnalyses,
      wateringEvents,
      efficiency: Math.round(efficiency),
      confidence: Math.round(avgConfidence),
      currentConditions: {
        moisture: latestData.moisture || 0,
        temperature: latestData.temperature || 0,
        humidity: latestData.humidity || 0,
      },
      systemStatus: {
        uptime: 98.5,
        lastAnalysis: "5 minutes ago",
        waterSaved: Math.round((totalAnalyses - wateringEvents) * 2.5),
      },
    };
  }

  generateAnalytics(data) {
    // Daily trends for chart
    const dailyTrends = this.groupByDate(data);

    // Moisture distribution
    const moistureDistribution = this.calculateDistribution(
      data.map((item) => item.moisture),
      [0, 300, 600, 1023],
      ["low", "medium", "high"]
    );

    // Temperature distribution
    const temperatureDistribution = this.calculateDistribution(
      data.map((item) => item.temperature),
      [0, 20, 30, 50],
      ["low", "medium", "high"]
    );

    return {
      dailyTrends,
      moistureDistribution,
      temperatureDistribution,
    };
  }

  groupByDate(data) {
    const grouped = {};

    data.forEach((item) => {
      const date = item.date;
      if (!grouped[date]) {
        grouped[date] = {
          date,
          analyses: 0,
          watering: 0,
          avgMoisture: 0,
          avgTemp: 0,
        };
      }

      grouped[date].analyses++;
      if (item.watering) grouped[date].watering++;
      grouped[date].avgMoisture += item.moisture;
      grouped[date].avgTemp += item.temperature;
    });

    // Calculate averages
    Object.values(grouped).forEach((day) => {
      day.avgMoisture = Math.round(day.avgMoisture / day.analyses);
      day.avgTemp = Math.round((day.avgTemp / day.analyses) * 10) / 10;
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }

  calculateDistribution(values, thresholds, labels) {
    const distribution = {};
    const total = values.length;

    labels.forEach((label, index) => {
      const min = thresholds[index];
      const max = thresholds[index + 1];
      const count = values.filter((val) => val >= min && val < max).length;
      distribution[label] = Math.round((count / total) * 100);
    });

    return distribution;
  }

  generateHistory(data) {
    const recentActivities = data
      .slice(-10) // Last 10 activities
      .reverse()
      .map((item) => ({
        type: item.watering ? "watering" : "analysis",
        title: item.watering ? "Watering Completed" : "Analysis Completed",
        time: this.formatTimeAgo(item.date),
        description: item.watering
          ? `Soil moisture was ${item.moisture}, watering was needed`
          : `Soil moisture at ${item.moisture}, no watering needed`,
        status: "success",
      }));

    return {
      recentActivities,
    };
  }

  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  }

  // Method to export report data
  async exportReport(reportData, format = "json") {
    switch (format) {
      case "csv":
        return this.generateCSV(reportData);
      case "txt":
        return this.generateTextReport(reportData);
      default:
        return JSON.stringify(reportData, null, 2);
    }
  }

  generateCSV(reportData) {
    const headers = [
      "Date",
      "Moisture",
      "Temperature",
      "Humidity",
      "Watering",
      "Confidence",
    ];
    const rows = reportData.analytics.dailyTrends.map((day) => [
      day.date,
      day.avgMoisture,
      day.avgTemp,
      "-", // humidity not tracked in simple version
      day.watering > 0 ? "Yes" : "No",
      "-", // confidence not tracked per day in simple version
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  generateTextReport(reportData) {
    const { summary, period } = reportData;

    return `
SMART IRRIGATION SYSTEM REPORT
=====================================

Period: ${period.startDate} to ${period.endDate} (${period.days} days)

SUMMARY
-------
Total Analyses: ${summary.totalAnalyses}
Watering Events: ${summary.wateringEvents}
System Efficiency: ${summary.efficiency}%
Average Confidence: ${summary.confidence}%

CURRENT CONDITIONS
------------------
Soil Moisture: ${summary.currentConditions.moisture} units
Temperature: ${summary.currentConditions.temperature}°C
Humidity: ${summary.currentConditions.humidity}%

SYSTEM STATUS
-------------
Uptime: ${summary.systemStatus.uptime}%
Water Saved: ${summary.systemStatus.waterSaved}L
Last Analysis: ${summary.systemStatus.lastAnalysis}

Report generated on: ${new Date().toLocaleString()}
    `.trim();
  }
}

export default SimpleReportPresenter;
