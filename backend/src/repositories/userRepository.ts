import { db } from "../config/database";

export const getUserByUsername = (username: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const updateUser = (
  userId: number,
  updates: { username?: string; password?: string }
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { username, password } = updates;
    const sql = `UPDATE users SET ${username ? "username = ?" : ""} ${
      password ? ", password = ?" : ""
    } WHERE id = ?`;
    const params: (string | number)[] = [];
    if (username) params.push(username);
    if (password) params.push(password);
    params.push(userId);

    db.run(sql, params, function (err) {
      if (err) reject(err);
      else
        resolve({
          message: "User updated successfully",
          changes: this.changes,
        });
    });
  });
};
