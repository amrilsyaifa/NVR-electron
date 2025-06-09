"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCCTV = exports.deleteCctv = exports.getCctvById = exports.getAllCCTVs = exports.createCctv = exports.countCctvs = exports.getCctvByName = void 0;
const database_1 = require("../config/database");
const getCctvByName = (name) => {
    return new Promise((resolve, reject) => {
        database_1.db.get("SELECT * FROM cctvs WHERE name = ?", [name], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};
exports.getCctvByName = getCctvByName;
// count all CCTVs in the database
const countCctvs = () => {
    return new Promise((resolve, reject) => {
        database_1.db.get("SELECT COUNT(*) as count FROM cctvs", [], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row.count);
        });
    });
};
exports.countCctvs = countCctvs;
const createCctv = (data) => {
    return new Promise((resolve, reject) => {
        const { name, ip, port, order_cctv, username, password } = data;
        database_1.db.run("INSERT INTO cctvs (name, ip, port, order_cctv, username, password) VALUES (?, ?, ?, ?, ?, ?)", [name, ip, port, order_cctv, username, password], function (err) {
            console.log("err:", err);
            if (err)
                reject(err);
            else
                resolve({ id: this.lastID });
        });
    });
};
exports.createCctv = createCctv;
const getAllCCTVs = () => {
    return new Promise((resolve, reject) => {
        database_1.db.all("SELECT * FROM cctvs", [], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};
exports.getAllCCTVs = getAllCCTVs;
const getCctvById = (id) => {
    return new Promise((resolve, reject) => {
        database_1.db.get("SELECT * FROM cctvs WHERE id = ?", [id], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};
exports.getCctvById = getCctvById;
const deleteCctv = (id) => {
    return new Promise((resolve, reject) => {
        database_1.db.run("DELETE FROM cctvs WHERE id = ?", [id], function (err) {
            if (err)
                reject(err);
            else if (this.changes === 0) {
                reject(new Error("CCTV not found"));
            }
            else {
                resolve({
                    message: "CCTV deleted successfully",
                    changes: this.changes,
                });
            }
        });
    });
};
exports.deleteCctv = deleteCctv;
const updateCCTV = (data) => {
    return new Promise((resolve, reject) => {
        const { id, name, ip, port, order_cctv, username, password } = data;
        database_1.db.run("UPDATE cctvs SET name = ?, ip = ?, port = ?, order_cctv = ?, username = ?, password = ? WHERE id = ?", [name, ip, port, order_cctv, username, password, id], function (err) {
            if (err)
                reject(err);
            else if (this.changes === 0) {
                reject(new Error("CCTV not found"));
            }
            else {
                resolve({ id });
            }
        });
    });
};
exports.updateCCTV = updateCCTV;
