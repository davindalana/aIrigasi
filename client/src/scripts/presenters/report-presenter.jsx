import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  async generateReport(dateRange = "7days", deviceId = "device1") {
    const [historicalData, latestData] = await Promise.all([
      this.fetchReportData(dateRange, deviceId),
      this.getLatestSensorData(deviceId),
    ]);

    if (historicalData.length === 0) {
      return null;
    }

    return {
      summary: this.generateSummary(historicalData, latestData),
      history: this.generateHistory(historicalData),
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

  generateSummary(historicalData, latestData) {
    const totalAnalyses = historicalData.length;
    const wateringEvents = historicalData.filter(
      (d) => d.Soil_Moisture < 400
    ).length;

    const lastAnalysisTimestamp =
      latestData.timestamp ||
      (historicalData.length > 0
        ? historicalData[historicalData.length - 1].timestamp
        : null);

    return {
      totalAnalyses,
      wateringEvents,
      currentConditions: {
        moisture: latestData.Soil_Moisture || 0,
        temperature: latestData.Temperature || 0,
        humidity: latestData.Air_Humidity || 0,
      },
      systemStatus: {
        uptime: 99.5,
        lastAnalysis: this.formatTimeAgo(lastAnalysisTimestamp),
      },
    };
  }

  generateHistory(data) {
    return {
      recentActivities: data
        .slice(-15)
        .reverse()
        .map((item) => ({
          type: item.Soil_Moisture < 400 ? "watering" : "analysis",
          title:
            item.Soil_Moisture < 400
              ? "Watering Completed"
              : "Analysis Completed",
          time: new Date(item.timestamp).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
          description: `Moisture: ${item.Soil_Moisture}, Temp: ${item.Temperature}°C, Hum: ${item.Air_Humidity}%`,
          status: "success",
        })),
    };
  }

  exportReportAsPDF(reportData, deviceId, dateRange) {
    if (!reportData) {
      alert("No data to export!");
      return;
    }

    const doc = new jsPDF();
    const { summary, history } = reportData;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Laporan Sistem AIrigasi", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Device ID: ${deviceId}`, 14, 30);
    doc.text(`Rentang Waktu: ${dateRange}`, 14, 36);
    doc.text(
      `Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`,
      14,
      42
    );

    doc.setLineWidth(0.5);
    doc.line(14, 48, 196, 48);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Laporan", 14, 60);

    autoTable(doc, {
      startY: 65,
      theme: "grid",
      head: [["Metrik", "Nilai"]],
      body: [
        ["Total Analisis", summary.totalAnalyses],
        ["Total Penyiraman", `${summary.wateringEvents} kali`],
        ["Analisis Terakhir", `${summary.systemStatus.lastAnalysis}`],
      ],
      styles: { fontSize: 11 },
      headStyles: { fillColor: [76, 175, 80] },
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Riwayat Aktivitas", 14, 20);

    const historyHead = [["Waktu", "Tipe", "Deskripsi", "Status"]];
    const historyBody = history.recentActivities.map((act) => [
      act.time,
      act.type,
      act.description,
      act.status,
    ]);

    autoTable(doc, {
      startY: 28,
      head: historyHead,
      body: historyBody,
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [102, 126, 234] },
    });

    const fileName = `Laporan-AIrigasi-${deviceId}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  }

  formatTimeAgo(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
  }
}

export default SimpleReportPresenter;
