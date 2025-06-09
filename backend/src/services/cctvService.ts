import {
  getCctvByName,
  countCctvs,
  createCctv,
  getAllCCTVs,
  getCctvById,
  deleteCctv,
  updateCCTV,
} from "../repositories/cctvRepository";
import { CreateCCTV } from "../interfaces/cctv";

export const create = async (data: CreateCCTV) => {
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
  const existingCCTV = await getCctvByName(name);
  if (existingCCTV) {
    throw new Error("CCTV with this name already exists");
  }

  const lastOrder = await countCctvs();

  // create a new CCTV entry
  const params = {
    name,
    ip,
    port,
    order_cctv: lastOrder !== null ? lastOrder + 1 : 1,
    username,
    password,
  };

  const result = await createCctv(params);

  return { message: "CCTV created successfully", id: result.id };
};

//update CCTV entry by id
export const update = async (id: number, data: CreateCCTV) => {
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
  const existingCCTV = await getCctvByName(name);
  if (existingCCTV && existingCCTV.id !== id) {
    throw new Error("CCTV with this name already exists");
  }
  // get the existing CCTV entry
  const existingCctv = await getCctvById(id);
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
  const result = await updateCCTV(params);
  return { message: "CCTV updated successfully", id: result.id };
};

// gets all CCTV entries from cctv table
export const gets = async () => {
  const cctvs = await getAllCCTVs();
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

// gets a CCTV entry by id from cctv table
export const getById = async (id: number) => {
  const cctv = await getCctvById(id);
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

// delete a CCTV entry by id from cctv table
export const deleteID = async (id: number) => {
  const cctv = await getCctvById(id);
  if (!cctv) {
    throw new Error("CCTV not found");
  }

  const result = await deleteCctv(id);
  return {
    id: result.id,
  };
};
