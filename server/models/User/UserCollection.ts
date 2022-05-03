import mongoose, { Model, Schema } from "mongoose";
import UserDocument from "./UserDocument";

export const userSchema: Schema = new mongoose.Schema({
    email: { type: String, unique: true }
}, { timestamps: true });

const UserCollection: Model<UserDocument> = mongoose.model("User", userSchema);
export default UserCollection;
