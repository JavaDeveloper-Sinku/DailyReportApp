import * as FileSystem from "expo-file-system/legacy";

const REPORTS_DIR = (FileSystem.documentDirectory || "") + "reports/";

// Ensure reports directory exists
export const ensureReportsDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(REPORTS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(REPORTS_DIR, { intermediates: true });
    console.log("Reports directory created:", REPORTS_DIR);
  }
};

// Get today's file path
export const getTodayReportPath = () => {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  return REPORTS_DIR + dateStr + ".json";
};

// Save a report
export const saveReport = async (reportData: any) => {
  await ensureReportsDirExists();
  const fileUri = getTodayReportPath();
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(reportData), {
    encoding: FileSystem.EncodingType.UTF8,
  });
  console.log("Report saved:", fileUri);
};

// Read today's report
export const readReport = async () => {
  const fileUri = getTodayReportPath();
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (!fileInfo.exists) return null;
  const content = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return JSON.parse(content);
};

// List all reports
export const listAllReports = async () => {
  await ensureReportsDirExists();
  const files = await FileSystem.readDirectoryAsync(REPORTS_DIR);
  const reports = [];
  for (const file of files) {
    const content = await FileSystem.readAsStringAsync(REPORTS_DIR + file, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    reports.push(JSON.parse(content));
  }
  return reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
