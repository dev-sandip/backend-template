import ENV_CONFIG from "@/config/env.config";
import { STATUS } from "@/constants/status.const";
import { Response } from "express";

export interface IResponse {
    status: number;
    message?: string;
    statusText?: string;
    error?: any;
    data?: any;
    forceError?: boolean; // force error to show in response in production
}

export const sendRes = (res: Response, responseData: IResponse) => {
    let error = undefined as string | undefined;
    if (responseData.error) {
        if (ENV_CONFIG.NODE_ENV === "development" || responseData.forceError) {
            error = responseData.error;
        } else {
            error =
                "The actual error has been hidden for security reasons, Please report the administrator for more information.";
        }
    }

    return res.status(responseData.status).json({
        ...STATUS[responseData.status || 200],
        ...responseData,
        error,
    });
};