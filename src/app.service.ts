import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "./dto/schema";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { CreateUSerDto } from "./dto/createuserdto";
import { UpdateUserDto } from "./dto/updateuserdto";
import * as bcrypt from "bcrypt"
import {JwtService} from "@nestjs/jwt"
@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService:JwtService) {}

  async createuser(createuserDto: CreateUSerDto): Promise<User> {
    const {username, password, role} = createuserDto;
    const hashedpassword = await bcrypt.hash(password,10);
    const user = await this.userModel.create({username, password:hashedpassword,role});
    return user;
  }

  async getuser(): Promise<User[]> {
    const get = await this.userModel.find({}, { password: 0 });
    return get;
  }

  async getuserbyid(userId: mongoose.Types.ObjectId): Promise<User> {
    const getbyid = await this.userModel.findById(userId);
    if (!getbyid) {
      throw new NotFoundException(`User not found with this #${userId}`);
    }
    return getbyid;
  }

  async deleteuserbyid(userId: mongoose.Types.ObjectId) {
    const deletebyId = await this.userModel.findByIdAndDelete(userId);

    if (!deletebyId) {
      throw new NotFoundException(`User with this #${userId} not found`);
    }
    return deletebyId;
  }

  async updateByid(
    userId: mongoose.Types.ObjectId,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const updatebyid = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true }
    );
    if (!updatebyid) {
      throw new NotFoundException(`Unsuccessfull`);
    }
    return updatebyid;
  }



  async login(username:string,password:string){
    const usersign = await this.findUserByName(username);
    if(!usersign){
      throw new NotFoundException(`User is not found`)
    }

    const validPassword = await bcrypt.compare(password, usersign.password);
    if(!validPassword){
      throw new UnauthorizedException(`Your password is wrong`)
    }

    const payload={
      sub: usersign.id,
      role: usersign.id
    }

    const accessToken = this.jwtService.sign(payload,{secret:process.env.JWT_SECRET})

    return {accessToken}
  }




  async findUserByName(username:string){
    return await this.userModel.findOne({username})
  }
}
