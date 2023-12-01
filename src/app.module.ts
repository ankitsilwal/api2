import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './dto/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{name:User.name, schema:UserSchema}]),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    JwtModule.register({
      secret :`${process.env.JWT_SECRET}`,
      signOptions:{expiresIn:"1h"}
    })

  ],
  controllers: [AppController],
  providers: [AppService,JwtService],
})
export class AppModule {}
