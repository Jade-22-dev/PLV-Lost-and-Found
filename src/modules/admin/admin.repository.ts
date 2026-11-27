import type {
  allowedAdminNumberRow,
  userRow,
  departmentRow,
} from "./types/admin.type.js";
import type { createAdminData } from "./types/admin.type.js";
import pool from "../../config/db.js";
import { ResultSetHeader } from "mysql2";

const toUser = (row: userRow) => ({
  id: row.user_id,
  user_role: row.user_role,
  firstname: row.first_name,
  lastname: row.last_name,
  create_at: row.created_at,
});

//Verify the admin id if exist
export const checkAndVerifyAdminNumbers = async (
  idNumbers: string,
  bool: boolean,
) => {
  const [rows] = await pool.execute<allowedAdminNumberRow[]>(
    "SELECT admin_number, is_registered FROM allowed_admin_numbers WHERE admin_number = ? AND is_registered = ?",
    [idNumbers, bool],
  );
  return rows[0] ?? null;
};

// Get the Id of department
export const findDepartmentsById = async (department: string) => {
  const [dep] = await pool.execute<departmentRow[]>(
    "SELECT department_id FROM departments WHERE department_code = ? ",
    [department],
  );

  return dep[0]?.department_id ?? null;
};

//Get the inserted admin
const findByid = async (userId: number) => {
  const [result] = await pool.execute<userRow[]>(
    "SELECT * FROM users WHERE user_id = ?",
    [userId],
  );

  return result[0] ? toUser(result[0]) : null;
};

export const create = async ({
  departmentId,
  user_role,
  firstName,
  surname,
  email,
  passwords,
  idNumbers,
}: createAdminData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Insert into users
    const [userResult] = await connection.execute<ResultSetHeader>(
      "INSERT INTO users (department_id, user_role, first_name, last_name, email) VALUES(?, ?, ?, ?, ?)",
      [departmentId, user_role, firstName, surname, email],
    );
    const userId = userResult.insertId;

    // Insert into admin
    await connection.execute<ResultSetHeader>(
      "INSERT INTO admins (user_id, password_hash) VALUES(?, ?)",
      [userId, passwords],
    );
    // Update the allowed admin
    await connection.execute<ResultSetHeader>(
      "UPDATE allowed_admin_numbers SET is_registered = true WHERE admin_number = ?",
      [idNumbers],
    );

    await connection.commit();
    return findByid(userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
