import ENV_CONFIG from "@/config/env.config";
import { NextFunction, Request, Response } from "express";
import { IResponse, sendRes } from "./send-response";
import jwt from "jsonwebtoken";

/**
 * Verifies the authenticity of a token.
 * If the token is valid, it sets the decoded token data in `res.locals.jwtData` and calls the `next` middleware.
 * If the token is invalid or expired, it sends an error response with the appropriate status code.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction.
 * @param cookieName - The name of the cookie that contains the token.
 * @returns A Promise that resolves if the token is valid, or rejects with an error message if the token is invalid or expired.
 */
export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
    cookieName: string
) => {
    const token = req.signedCookies[cookieName];
    if (!token || token.trim() === "") {
        const response: IResponse = {
            status: 401,
            message: "Auth Error, Cookies not found",
        };
        return sendRes(res, response);
    }
    return new Promise<void>((resolve, reject) => {
        return jwt.verify(
            token,
            ENV_CONFIG.JWT_SECRET,
            (err: Error, data: unknown) => {
                if (err) {
                    reject(err.message);
                    return sendRes(res, {
                        status: 401,
                        message: "Auth Error, Invalid token",
                    });
                } else {
                    resolve();
                    res.locals.jwtData = data;
                    return next();
                }
            }
        );
    });
};