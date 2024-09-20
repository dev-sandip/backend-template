import mongoose from "mongoose";

const fileModel = new mongoose.Schema({
    fileId: {
        type: String,
    },
    name: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
    },
});

export const FileModel = mongoose.model("File", fileModel);
export default fileModel;