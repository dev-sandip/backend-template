import ENV_CONFIG from "@/config/env.config";

export const devLog = (...args: any[]) => {
    if (ENV_CONFIG.NODE_ENV === "development") {
        console.log("DEV LOG:");
        console.log(...args);
    }
};