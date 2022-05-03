import mongoose, { Model, Schema } from "mongoose";
import MemoryDocument from "./MemoryDocument";

export const memorySchema: Schema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    isPrivate: Boolean
}, { timestamps: true });

const MemoryCollection: Model<MemoryDocument> = mongoose.model("Memory", memorySchema);
export default MemoryCollection;
