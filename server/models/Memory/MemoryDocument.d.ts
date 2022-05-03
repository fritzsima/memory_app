import mongoose from "mongoose";
import Memory from "../../../client/src/models/Memory.d";

export default interface MemoryDocument extends Memory, mongoose.Document {}
