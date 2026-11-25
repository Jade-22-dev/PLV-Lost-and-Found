import bcrypt from "bcrypt";
import type {
  registerAdminSchema,
  loginAdminSchema,
} from "../../schemas/admin.schema.js";
import * as adminRepository from "./admin.repository.js";
import AppError from "../../utils/AppError.js";

const SALT_ROUNDS = 12;
const user_role = "ADMIN";

export const registerAd = async (data: registerAdminSchema) => {
  const adminId = await adminRepository.checkAndVerifyAdminNumbers(
    data.idNumbers,
    false,
  );
  const departmentId = await adminRepository.findDepartmentsById(
    data.department,
  );

  if (!adminId)
    throw new AppError(
      400,
      "INVALID_ADMIN_NUMBER",
      "Invalid or already registered admin number.",
    );

  if (!departmentId)
    throw new AppError(400, "INVALID_DEPARTMENT_ID", "Invalid department id");

  const passwordsHash = await bcrypt.hash(data.passwords, SALT_ROUNDS);

  const result = await adminRepository.create({
    firstName: data.firstName,
    surname: data.surname,
    idNumbers: data.idNumbers,
    email: data.email,
    departmentId,
    user_role,
    passwords: passwordsHash,
  });

  return result;
};

export const loginAdmin = async (data: loginAdminSchema) => {
  const adminId = await adminRepository.checkAndVerifyAdminNumbers(
    data.idNumbers,
    true,
  );

  if (!adminId)
    throw new AppError(
      400,
      "INVALID_ADMIN_NUMBER",
      "Invalid or already registered admin number.",
    );
  
};
