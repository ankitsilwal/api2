import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Delete,
  Put,
  UnauthorizedException,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { CreateUSerDto } from "./dto/createuserdto";
import { User } from "./dto/schema";
import mongoose from "mongoose";
import { UpdateUserDto } from "./dto/updateuserdto";
import { SignInDto } from "./dto/signindto";

@Controller("add")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createuser(@Body() createuserdto: CreateUSerDto) {
    try {
      return await this.appService.createuser(createuserdto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get()
  async getall(): Promise<User[]> {
    try {
      return await this.appService.getuser();
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  @Get(":id")
  async getbyid(@Param("id") userId: mongoose.Types.ObjectId): Promise<User> {
    try {
      return await this.appService.getuserbyid(userId);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Delete(":id")
  async deletebyid(@Param("id") userId: mongoose.Types.ObjectId) {
    try {
      const deleteByI = await this.appService.deleteuserbyid(userId);
      return { message: `User Deleted with this id ${userId}` };
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  @Put(":id")
  async updatebyid(
    @Param("id") userId: mongoose.Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto
  ) {
    try {
      const updateuser = await this.appService.updateByid(
        userId,
        updateUserDto
      );
      return { message: `User Updated`, updateuser };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Post("login")
  async login(@Body() signinDto: SignInDto) {
    try {
      const res = await this.appService.login(
        signinDto.username,
        signinDto.password
      );
      return res;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
