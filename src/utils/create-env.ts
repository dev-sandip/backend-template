import { z } from "zod";
import { fromError } from "zod-validation-error";

export interface IEnv {
    [key: string]: {
        value: string;
        required?: boolean;
        type?: "string" | "number" | "boolean" | "array"; // array -> comma separated strings
        isUrl?: boolean; // if the value is a URL, remove trailing slash
    };
}

type ParsedEnv<T extends IEnv> = {
    [K in keyof T]: T[K]["type"] extends "number"
    ? number
    : T[K]["type"] extends "boolean"
    ? boolean
    : T[K]["type"] extends "array"
    ? string[]
    : string;
};

/**
 * Create a typed environment object from a schema
 */
export const createEnv = <T extends IEnv>(env: T): ParsedEnv<T> => {
    const envKeys = Object.keys(env) as Array<keyof T>;

    const parsedEnv = envKeys.reduce((acc, key) => {
        const schema = createSchema(env[key], key as string);
        const { value } = env[key];

        let parsed: string | number | boolean | string[] = "";

        try {
            parsed = schema.parse(value);
        } catch (e) {
            const message = fromError(e).toString();
            console.error("\nENVIRONMENT VARIABLES ERROR:");
            console.error(message);
        }

        acc[key] = parsed as ParsedEnv<T>[keyof T];
        return acc;
    }, {} as ParsedEnv<T>);
    return parsedEnv;
};

const createSchema = (env: IEnv[string], key: string) => {
    const { required = true, type = "string", isUrl = false } = env;

    // if the value is not provided, throw an error
    const schema = z
        .string({
            message: `${key} must be a string`,
        })
        .refine((val) => {
            if (required && !val) {
                return `${key} is required`;
            }

            if (type === "number" && isNaN(Number(val))) {
                return `${key} must be a number`;
            }

            if (type === "boolean" && !["true", "false"].includes(val)) {
                return `${key} must be a boolean`;
            }

            if (isUrl && !val.startsWith("http")) {
                return `${key} must be a URL`;
            }

            if (type === "array" && val.split(",").length < 1) {
                return `${key} must be a comma separated string`;
            }

            return true;
        })
        .transform((val) => {
            if (type === "number") {
                return Number(val);
            }

            if (type === "boolean") {
                return val === "true";
            }

            if (type === "array") {
                return val.split(",").map((v) => v.trim());
            }

            return val;
        })
        .transform((val) => {
            if (isUrl) {
                // remove trailing slash

                if (typeof val === "string") {
                    return val.replace(/\/$/, "");
                }

                if (Array.isArray(val)) {
                    return val.map((v) => v.replace(/\/$/, ""));
                }
            }
            return val;
        });

    return schema;
};