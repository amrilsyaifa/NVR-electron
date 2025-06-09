"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteID = exports.getById = exports.gets = exports.update = exports.create = void 0;
const cctvRepository_1 = require("../repositories/cctvRepository");
const create = async (data) => {
    // create a new CCTV entry to cctv table
    const { name, ip, port, username, password } = data;
    // validate required fields
    if (!name) {
        throw new Error("Name is required");
    }
    if (!ip) {
        throw new Error("IP address is required");
    }
    if (!port) {
        throw new Error("Port is required");
    }
    if (isNaN(port) || port <= 0 || port > 65535) {
        throw new Error("Port must be a valid number between 1 and 65535");
    }
    if (!username) {
        throw new Error("Username is required");
    }
    if (!password) {
        throw new Error("Password is required");
    }
    // check if CCTV with the same name already exists
    const existingCCTV = await (0, cctvRepository_1.getCctvByName)(name);
    if (existingCCTV) {
        throw new Error("CCTV with this name already exists");
    }
    const lastOrder = await (0, cctvRepository_1.countCctvs)();
    // create a new CCTV entry
    const params = {
        name,
        ip,
        port,
        order_cctv: lastOrder !== null ? lastOrder + 1 : 1,
        username,
        password,
    };
    const result = await (0, cctvRepository_1.createCctv)(params);
    return { message: "CCTV created successfully", id: result.id };
};
exports.create = create;
//update CCTV entry by id
const update = async (id, data) => {
    // update a CCTV entry by id in cctv table
    const { name, ip, port, username, password } = data;
    // validate required fields
    if (!name) {
        throw new Error("Name is required");
    }
    if (!ip) {
        throw new Error("IP address is required");
    }
    if (!port) {
        throw new Error("Port is required");
    }
    if (isNaN(port) || port <= 0 || port > 65535) {
        throw new Error("Port must be a valid number between 1 and 65535");
    }
    if (!username) {
        throw new Error("Username is required");
    }
    if (!password) {
        throw new Error("Password is required");
    }
    // check if CCTV with the same name already exists
    const existingCCTV = await (0, cctvRepository_1.getCctvByName)(name);
    if (existingCCTV && existingCCTV.id !== id) {
        throw new Error("CCTV with this name already exists");
    }
    // get the existing CCTV entry
    const existingCctv = await (0, cctvRepository_1.getCctvById)(id);
    if (!existingCctv) {
        throw new Error("CCTV not found");
    }
    // update the CCTV entry
    const params = {
        id,
        name,
        ip,
        port,
        order_cctv: existingCctv.order_cctv,
        username,
        password,
    };
    const result = await (0, cctvRepository_1.updateCCTV)(params);
    return { message: "CCTV updated successfully", id: result.id };
};
exports.update = update;
// gets all CCTV entries from cctv table
const gets = async () => {
    const cctvs = await (0, cctvRepository_1.getAllCCTVs)();
    if (!cctvs || cctvs.length === 0) {
        throw new Error("No CCTV entries found");
    }
    return cctvs.map((cctv) => ({
        id: cctv.id,
        name: cctv.name,
        ip: cctv.ip,
        port: cctv.port,
        order_cctv: cctv.order_cctv,
        createdAt: cctv.created_at,
        username: cctv.username,
        password: cctv.password,
    }));
};
exports.gets = gets;
// gets a CCTV entry by id from cctv table
const getById = async (id) => {
    const cctv = await (0, cctvRepository_1.getCctvById)(id);
    if (!cctv) {
        throw new Error("CCTV not found");
    }
    return {
        id: cctv.id,
        name: cctv.name,
        ip: cctv.ip,
        port: cctv.port,
        order_cctv: cctv.order_cctv,
        createdAt: cctv.created_at,
        username: cctv.username,
        password: cctv.password,
    };
};
exports.getById = getById;
// delete a CCTV entry by id from cctv table
const deleteID = async (id) => {
    const cctv = await (0, cctvRepository_1.getCctvById)(id);
    if (!cctv) {
        throw new Error("CCTV not found");
    }
    const result = await (0, cctvRepository_1.deleteCctv)(id);
    return {
        id: result.id,
    };
};
exports.deleteID = deleteID;
