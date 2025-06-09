import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByUsername, updateUser } from "../repositories/userRepository";
import { SECRET_KEY } from "../constant/jwt";

export const login = async (username: string, password: string) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  return { token };
};

export const update = async (
  username: string,
  password: string,
  userId: number
) => {
  // Here you would typically update the user in the database.
  // For simplicity, let's assume we have a function updateUser that does this.
  const updatedUser = await updateUser(userId, { username, password });

  if (!updatedUser) {
    throw new Error("Failed to update user");
  }

  return { message: "Updated successfully" };
};
