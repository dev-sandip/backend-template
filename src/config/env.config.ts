import { createEnv } from "@/utils/create-env";
import { config } from "dotenv";

config();

const ENV_CONFIG = createEnv({
    MONGO_URI: {
        value: process.env.MONGO_URI,
        required: true,
    },
    PORT: {
        value: process.env.PORT || "5000",
        required: false,
        type: "number",
    },
    MAX_REQUEST_SIZE: {
        value: process.env.MAX_REQUEST_SIZE || "10mb",
        required: false,
    },
    COOKIE_SECRET: {
        value: process.env.COOKIE_SECRET,
        required: true,
    },
    FRONTEND_DOMAIN: {
        value: process.env.FRONTEND_DOMAIN,
        required: true,
    },
    FRONTEND_URL: {
        value: process.env.FRONTEND_URL,
        required: true,
        type: "array",
        isUrl: true,
    },
    JWT_SECRET: {
        value: process.env.JWT_SECRET,
        required: true,
    },
    AUTH_TOKEN_COOKIE_NAME: {
        value: process.env.AUTH_TOKEN_COOKIE_NAME,
        required: true,
    },
    NODE_ENV: {
        value: process.env.NODE_ENV || "development",
        required: false,
    },
});

export default ENV_CONFIG;