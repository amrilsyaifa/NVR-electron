import { db } from "../../config/database";

export async function up() {
  return new Promise<void>((resolve, reject) => {
    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='cctvs'`,
      [],
      (err, row) => {
        if (err) return reject(err);
        if (row) {
          console.log("Migration: 'cctvs' table already exists, skipping");
          return resolve();
        }

        // Kalau belum ada, buat tabel
        db.run(
          `CREATE TABLE cctvs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            ip TEXT,
            port INTEGER,
            username TEXT,
            password TEXT,
            order_cctv INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
          (err) => {
            if (err) return reject(err);
            console.log("Migration: 'cctvs' table created successfully");
            resolve();
          }
        );
      }
    );
  });
}
