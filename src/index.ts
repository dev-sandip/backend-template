import { app } from "./app";
import ENV_CONFIG from "@/config/env.config";
import { connectToDB } from "./db";

// app
connectToDB()
    .then((res) => {
        console.log(res);
        app.listen(ENV_CONFIG.PORT, () => {
            console.log(`Server is running on PORT :${ENV_CONFIG.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });