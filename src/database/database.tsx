import * as SQLite from "expo-sqlite";


//Open the database
export const db = SQLite.openDatabaseAsync("daily_Reports.db");

//Create table
//UserFrom Screen 
export const createTables = async () => {
    const database = await db;
    database.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `);
}