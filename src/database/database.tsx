import * as SQLite from "expo-sqlite";

// Open database (async)
export const db = SQLite.openDatabaseAsync("daily_reports.db");

export const createTables = async () => {
  try {
    const database = await db;

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `);

    console.log("Users table created successfully.");
  } catch (error) {
    console.log("Error creating tables:", error);
  }
};
