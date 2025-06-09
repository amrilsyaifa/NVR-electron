import { db } from "../config/database";
import { CreateCCTV } from "../interfaces/cctv";

export const getCctvByName = (name: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM cctvs WHERE name = ?", [name], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// count all CCTVs in the database
export const countCctvs = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM cctvs", [], (err, row) => {
      if (err) reject(err);
      else resolve((row as { count: number }).count);
    });
  });
};

export const createCctv = (data: CreateCCTV): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { name, ip, port, order_cctv, username, password } = data;
    db.run(
      "INSERT INTO cctvs (name, ip, port, order_cctv, username, password) VALUES (?, ?, ?, ?, ?, ?)",
      [name, ip, port, order_cctv, username, password],
      function (err) {
        console.log("err:", err);
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

export const getAllCCTVs = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM cctvs", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getCctvById = (id: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM cctvs WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const deleteCctv = (id: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM cctvs WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else if (this.changes === 0) {
        reject(new Error("CCTV not found"));
      } else {
        resolve({
          message: "CCTV deleted successfully",
          changes: this.changes,
        });
      }
    });
  });
};

export const updateCCTV = (data: CreateCCTV & { id: number }): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { id, name, ip, port, order_cctv, username, password } = data;
    db.run(
      "UPDATE cctvs SET name = ?, ip = ?, port = ?, order_cctv = ?, username = ?, password = ? WHERE id = ?",
      [name, ip, port, order_cctv, username, password, id],
      function (err) {
        if (err) reject(err);
        else if (this.changes === 0) {
          reject(new Error("CCTV not found"));
        } else {
          resolve({ id });
        }
      }
    );
  });
};
