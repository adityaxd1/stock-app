import { Response } from "express";

export function successResp(res: Response, data: unknown, msg = "Successful Response", status = 200) {
  return res.status(status).send({ status, msg, success: true, error: false, data });
}
export function errorResp(res: Response, data: unknown, msg = "Something Went Wrong", status = 401) {
  return res.status(status).send({ status, msg, success: false, error: true, data });
}
