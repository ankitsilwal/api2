import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({timestamps:true})

export class User{
    @Prop()
    username:string
    @Prop()
    password:string;
    @Prop()
    role: string
}


export const UserDocument = User && Document;
export const UserSchema = SchemaFactory.createForClass(User)
