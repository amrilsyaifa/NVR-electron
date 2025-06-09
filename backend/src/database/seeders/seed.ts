import { db } from "../../config/database";
import bcrypt from "bcrypt";

async function seed() {
  try {
    const username = "admin";
    const plainPassword = "admin123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            console.log("User already exists, skipping...");
          } else {
            console.error("Error seeding user:", err.message);
          }
        } else {
          console.log("Seed user inserted with ID:", this.lastID);
        }
        db.close();
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    db.close();
  }
}

seed();
