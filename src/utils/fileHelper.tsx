import * as FileSystem from "expo-file-system/legacy";

const REPORTS_DIR = (FileSystem.documentDirectory || "") + "reports/";

/* ================= DIR ================= */

export const ensureReportsDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(REPORTS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(REPORTS_DIR, { intermediates: true });
  }
};

/* ================= FILE NAME ================= */

export const generateReportFilePath = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  return REPORTS_DIR + `${date}_${time}.json`;
};

/* ================= SAVE NEW ================= */

export const saveReport = async (reportData: any) => {
  await ensureReportsDirExists();

  const fileUri = generateReportFilePath();

  await FileSystem.writeAsStringAsync(
    fileUri,
    JSON.stringify(reportData),
    { encoding: FileSystem.EncodingType.UTF8 }
  );

  return fileUri;
};

/* ================= LIST ================= */

export const listAllReports = async () => {
  await ensureReportsDirExists();

  const files = await FileSystem.readDirectoryAsync(REPORTS_DIR);
  const reports: any[] = [];

  for (const file of files) {
    try {
      const content = await FileSystem.readAsStringAsync(REPORTS_DIR + file);
      const data = JSON.parse(content);

      reports.push({
        ...data,
        fileName: file, // 🔑 real identity
      });
    } catch {}
  }

  return reports.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/* ================= READ ================= */

export const readReportByFileName = async (fileName: string) => {
  const uri = REPORTS_DIR + fileName;
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) return null;

  const content = await FileSystem.readAsStringAsync(uri);
  return JSON.parse(content);
};

/* ================= DELETE ================= */

export const deleteReport = async (fileName: string) => {
  const uri = REPORTS_DIR + fileName;
  await FileSystem.deleteAsync(uri, { idempotent: true });
  return true;
};

/* ================= UPDATE ================= */

export const saveReportByFileName = async (
  fileName: string,
  data: any
) => {
  const uri = REPORTS_DIR + fileName;

  await FileSystem.writeAsStringAsync(
    uri,
    JSON.stringify(data),
    { encoding: FileSystem.EncodingType.UTF8 }
  );

  return true;
};
