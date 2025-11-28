import * as FileSystem from "expo-file-system";

const REPORTS_DIR = FileSystem.Paths.document.uri + "/reports/";

// Ensure reports directory exists
export const ensureReportsDirExists = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(REPORTS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(REPORTS_DIR, { intermediates: true });
      console.log("Reports directory created:", REPORTS_DIR);
    }
  } catch (err) {
    console.log("Error creating reports directory:", err);
  }
};

// Get today's file path
export const getTodayReportPath = () => {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  return REPORTS_DIR + dateStr + ".json";
};

// Save a report (overwrites today's report)
export const saveReport = async (reportData: any) => {
  try {
    await ensureReportsDirExists();
    const fileUri = getTodayReportPath();
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(reportData),
      { encoding: "utf8" }
    );
    console.log("Report saved:", fileUri);
  } catch (err) {
    console.log("Error saving report:", err);
    throw err;
  }
};

// Read today's report
export const readReport = async () => {
  try {
    const fileUri = getTodayReportPath();
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) return null;

    const content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: "utf8",
    });
    return JSON.parse(content);
  } catch (err) {
    console.log("Error reading report:", err);
    return null;
  }
};

// List all reports
export const listAllReports = async () => {
  try {
    await ensureReportsDirExists();
    const files = await FileSystem.readDirectoryAsync(REPORTS_DIR);
    const reports = [];
    for (const file of files) {
      const content = await FileSystem.readAsStringAsync(REPORTS_DIR + file, {
        encoding: "utf8",
      });
      reports.push(JSON.parse(content));
    }

    // Sort by date descending
    return reports.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (err) {
    console.log("Error listing reports:", err);
    return [];
  }
};
