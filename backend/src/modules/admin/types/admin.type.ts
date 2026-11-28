import { RowDataPacket } from "mysql2";
import { registerAdminSchema } from "../../../schemas/admin.schema.js";

export type userRow = RowDataPacket & {
  user_id: number;
  first_name: string;
  user_role: string;
  last_name: string;
  created_at: string;
};

export type departmentRow = RowDataPacket & {
  department_id: number;
};

export type allowedAdminNumberRow = RowDataPacket & {
  admin_number: string;
  is_registered: number;
};

export type createAdminData = Omit<
  registerAdminSchema,
  "department" | "passwords"
> & {
  departmentId: number;
  passwords: string;
  user_role: string;
};

