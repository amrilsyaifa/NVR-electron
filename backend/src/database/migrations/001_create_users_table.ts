import { db } from "../../config/database";

export async function up() {
  return new Promise<void>((resolve, reject) => {
    // Cek dulu apakah tabel "users" sudah ada
    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`,
      [],
      (err, row) => {
        if (err) return reject(err);
        if (row) {
          console.log("Migration: 'users' table already exists, skipping");
          return resolve();
        }

        // Kalau belum ada, buat tabel
        db.run(
          `CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
          (err) => {
            if (err) return reject(err);
            console.log("Migration: 'users' table created successfully");
            resolve();
          }
        );
      }
    );
  });
}
