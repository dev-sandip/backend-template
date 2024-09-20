import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { sendRes } from "./send-response";
import { fromError } from "zod-validation-error";

export const validateBody = <T>(schema: ZodSchema<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            let parsed = schema.parse(req.body);
            req.body = parsed;
            next();
        } catch (e) {
            const message = fromError(e).toString();
            return sendRes(res, {
                status: 400,
                message,
                error: e.errors,
                forceError: true,
            });
        }
    };
};