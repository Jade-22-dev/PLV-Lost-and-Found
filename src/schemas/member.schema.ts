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
  .max(8, "Id number must be at most 8 characters");

const department = z.enum(["CEIT", "COED", "CABA", "CAS", "CPAG"], {
  message: "Please select a valid department",
});
const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid Email Address")
  .max(255, "Email must be at most 255 characters");

const section = z.coerce
  .number({
    message: "Select valid section",
  })
  .min(1, "Select valid section");

const course = z.enum(
  [
    // CABA
    "BSA",
    "BSBA-HRM",
    "BSBA-FM",
    "BSBA-MM",
    // COED
    "BECEd",
    "BSEd-English",
    "BSEd-Filipino",
    "BSEd-Math",
    "BSEd-Science",
    // CEIT
    "BSEd-SS",
    "BSIT",
    "BSEE",
    "BSCE",
    // CAS
    "BS Psychology",
    "BA Communication",
    "BSSW",
    // CPAG
    "BPA",
  ],
  { message: "Please select a valid course/program" },
);

export const registerSchema = z.object({
  firstName,
  surname,
  idNumbers,
  email,
  department,
  section,
  course,
});

export const loginSchema = z.object({
  surname,
  idNumbers,
});

export type registerSchema = z.infer<typeof registerSchema>;
export type loginSchema = z.infer<typeof loginSchema>;
