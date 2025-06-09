import { up as createUsersTable } from "./migrations/001_create_users_table";
import { up as createCctvTable } from "./migrations/002_create_cctvs_table";
import { db } from "../config/database";

async function migrate() {
  try {
    await createUsersTable();
    await createCctvTable();
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    db.close();
  }
}

migrate();
