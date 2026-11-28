import { Response, Request } from "express";
import * as AdminSchema from "../../schemas/admin.schema.js";
import safeParse from "../../utils/safeParse.js";
import * as AdminService from "./admin.service.js";

export const registerAdmin = async (req: Request, res: Response) => {
  const data = safeParse(AdminSchema.registerAdminSchema, req.body);

  const result = await AdminService.registerAd(data.data);

  res.status(201).json({ data: result });
};

export const loginAdmin = async(req:Request, res:Response) => {
  const data = safeParse(AdminSchema.loginAdminSchema, req.body);
  const result = await AdminService.loginAdmin(data.data);

  res.status(200).json({data: result});
};
