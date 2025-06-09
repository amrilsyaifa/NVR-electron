import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "backend", "database.sqlite");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect database", err);
  } else {
    console.log("SQLite database connected");
  }
});
