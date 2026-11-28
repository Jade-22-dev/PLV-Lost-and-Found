import { z } from "zod";

const firstName = z
  .string()
  .trim()
  .min(2, "First name must be at least 2 characters")
  .max(20, "First name must be at most 20 characters");

const surname = z
  .string()
  .trim()
  .min(2, "Last name must be at least 2 characters")
  .max(20, "Last name must be at most 20 characters");

const idNumbers = z
  .string()
  .trim()
  .max(11, "Id number must be at most 8 characters");

const department = z.enum(["CEIT", "COED", "CABA", "CAS", "CPAG"], {
  message: "Please select a valid department",
});
const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid Email Address")
  .max(255, "Email must be at most 255 characters");

const passwords = z
  .string()
  .trim()
  .min(8, "Passwords must be at least 8 characters")
  .max(40, "Passwords must be at most 40 characters");

export const registerAdminSchema = z.object({
  firstName,
  surname,
  idNumbers,
  department,
  email,
  passwords,
});

export const loginAdminSchema = z.object({
  email,
  idNumbers,
  passwords,
});

export type registerAdminSchema = z.infer<typeof registerAdminSchema>;
export type loginAdminSchema = z.infer<typeof loginAdminSchema>;