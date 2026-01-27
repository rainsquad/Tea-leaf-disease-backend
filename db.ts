import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("tea_disease.db");

export const initDB = () => {
  db.transaction((tx) => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS disease_reports (
        id TEXT PRIMARY KEY NOT NULL,
        latitude REAL,
        longitude REAL,
        disease_name TEXT,
        severity_override INTEGER,
        notes TEXT,
        created_at TEXT
      );
    `);
  });
};
