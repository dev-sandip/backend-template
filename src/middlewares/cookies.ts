import { Response } from "express";
import ENV_CONFIG from "@/config/env.config";
import jwt from "jsonwebtoken";
import { MarkRequired } from "@/types/utils";
import ms from "ms";

/**
 * Handles cookies by setting new cookies.
 * expiresIn is a string that can be parsed by the `ms` package.
 */
export const registerCookies = (
    res: Response,
    config: {
        payload: Object;
        cookieName: string;
        jwtConfig: MarkRequired<jwt.SignOptions, "expiresIn">;
    }
) => {
    const { payload, cookieName, jwtConfig } = config;

    const milliseconds = ms(jwtConfig.expiresIn as string);
    const token = jwt.sign(payload, ENV_CONFIG.JWT_SECRET, jwtConfig);

    const expires = new Date(Date.now() + milliseconds);

    res.cookie(cookieName, token, {
        path: "/",
        domain: ENV_CONFIG.FRONTEND_DOMAIN,
        expires: expires,
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
    });
};

/**
 * Clears the existing cookies.
 */
export const clearCookies = (res: Response, cookieName: string) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        domain: ENV_CONFIG.FRONTEND_DOMAIN,
        signed: true,
        path: "/",
        sameSite: "none",
        secure: true,
    });
};