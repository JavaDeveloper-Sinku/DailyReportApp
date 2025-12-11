import * as FileSystem from "expo-file-system/legacy";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

const REPORTS_DIR = (FileSystem.documentDirectory || "") + "reports/";

// ------------------------------
// Ensure reports directory exists
// ------------------------------
export const ensureReportsDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(REPORTS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(REPORTS_DIR, { intermediates: true });
    console.log("Reports directory created:", REPORTS_DIR);
  }
};

// ------------------------------
// Generate unique file name
// ------------------------------
export const generateReportFilePath = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
  const fileName = `${date}_${time}.json`;
  return REPORTS_DIR + fileName;
};

// ------------------------------
// Save a new report 
// ------------------------------
export const saveReport = async (reportData: any) => {
  await ensureReportsDirExists();

  // Generate reportId if not exists
  if (!reportData.reportId) {
    reportData.reportId = uuidv4();
  }

  const fileUri = generateReportFilePath();

  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(reportData), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  console.log("Report saved:", fileUri);
  return fileUri;
};

// ------------------------------
// List all reports
// ------------------------------
export const listAllReports = async () => {
  await ensureReportsDirExists();

  const files = await FileSystem.readDirectoryAsync(REPORTS_DIR);
  const reports: any[] = [];

  for (const file of files) {
    const filePath = REPORTS_DIR + file;
    try {
      const content = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const data = JSON.parse(content);
      data.fileName = file; // store filename for editing/deleting

      // Generate reportId if old report doesn't have one
      if (!data.reportId) data.reportId = uuidv4();

      reports.push(data);
    } catch (err) {
      console.log("Failed to read file:", file, err);
    }
  }

  // latest first
  return reports.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// ------------------------------
// Read one report by fileName
// ------------------------------
export const readReportByFileName = async (fileName: string) => {
  const fileUri = REPORTS_DIR + fileName;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) return null;

  const content = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const data = JSON.parse(content);

  if (!data.reportId) data.reportId = uuidv4();

  return data;
};

// ------------------------------
// DELETE a report by file name
// ------------------------------
export const deleteReport = async (fileName: string) => {
  const fileUri = REPORTS_DIR + fileName;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) return false;

  await FileSystem.deleteAsync(fileUri, { idempotent: true });
  console.log("Deleted report:", fileUri);

  return true;
};

// ------------------------------
// DELETE helper for screen usage
// ------------------------------
export const deleteReportFile = async (fileName: string) => {
  try {
    const success = await deleteReport(fileName);
    if (!success) throw new Error("File does not exist");
    return true;
  } catch (err) {
    console.log("Failed to delete report:", err);
    return false;
  }
};

// ------------------------------
// Save report by overwriting existing file
// ------------------------------
export const saveReportByFileName = async (fileName: string, data: any) => {
  try {
    // Ensure reportId exists
    if (!data.reportId) data.reportId = uuidv4();

    const fileUri = REPORTS_DIR + fileName;

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return true;
  } catch (err) {
    console.log("Error saving:", err);
    return false;
  }
};
