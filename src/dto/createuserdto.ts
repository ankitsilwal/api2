import mongoose from "mongoose";

export class CreateUSerDto{
    id: mongoose.Types.ObjectId;
    username: string;
    password:string;
    role:string
}