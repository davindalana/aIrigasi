class SimpleReportPresenter {
  constructor() {
    this.mockData = this.generateMockDataForAllDevices();
  }

  generateMockDataForAllDevices() {
    const allDeviceData = {};
    const deviceIds = ["device1", "device2", "device3"];

    deviceIds.forEach((deviceId) => {
      const data = [];
      const today = new Date();

      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        let moisture, temperature, humidity, needsWatering;

        if (deviceId === "device2") {
          moisture = 180 + Math.random() * 400;
          temperature = 28 + Math.random() * 10;
          humidity = 35 + Math.random() * 45;
          needsWatering = moisture < 300;
        } else if (deviceId === "device3") {
          moisture = 350 + Math.random() * 300;
          temperature = 23 + Math.random() * 7;
          humidity = 60 + Math.random() * 30;
          needsWatering = moisture < 400;
        } else {
          moisture = 200 + Math.random() * 600;
          temperature = 20 + Math.random() * 15;
          humidity = 40 + Math.random() * 40;
          needsWatering = moisture < 350;
        }

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
          deviceId: deviceId,
        });
      }
      allDeviceData[deviceId] = data;
    });

    return allDeviceData;
  }

  async generateReport(dateRange = "7days", deviceId = "device1") {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const days = this.getDaysFromRange(dateRange);
    const allDataForDevice = this.mockData[deviceId] || [];
    const filteredData = allDataForDevice.slice(-days);

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
      totalAnalyses > 0
        ? ((totalAnalyses - wateringEvents) / totalAnalyses) * 100 +
          Math.random() * 10
        : 100;

    const latestData = data[data.length - 1] || {};

    return {
      totalAnalyses,
      wateringEvents,
      efficiency: Math.min(100, Math.round(efficiency)),
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
    const dailyTrends = this.groupByDate(data);

    const moistureDistribution = this.calculateDistribution(
      data.map((item) => item.moisture),
      [0, 300, 600, 1023],
      ["low", "medium", "high"]
    );

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

    Object.values(grouped).forEach((day) => {
      day.avgMoisture = Math.round(day.avgMoisture / day.analyses);
      day.avgTemp = Math.round((day.avgTemp / day.analyses) * 10) / 10;
      day.analysesScaled = Math.min(10, day.analyses);
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
      .slice(-10)
      .reverse()
      .map((item, index) => {
        let type, title, description, status;

        if (item.watering) {
          type = "watering";
          title = "Watering Completed";
          description = `Soil moisture was ${item.moisture} units, watering was needed.`;
          status = "success";
        } else {
          type = "analysis";
          title = "Analysis Completed";
          description = `Soil moisture at ${item.moisture} units, no watering needed.`;
          status = "success";
        }

        if (index === 2) {
          type = "alert";
          title = "High Temperature Alert";
          description = `Temperature reached ${item.temperature}°C. Consider shade or increased misting.`;
          status = "warning";
        } else if (index === 5) {
          type = "system";
          title = "System Maintenance Log";
          description = `Routine system check performed. All sensors operating optimally.`;
          status = "info";
        }

        return {
          type: type,
          title: title,
          time: this.formatTimeAgo(item.date),
          description: description,
          status: status,
        };
      });

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
      "-",
      day.watering > 0 ? "Yes" : "No",
      "-",
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
