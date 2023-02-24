import { Module } from '@nestjs/common';
import { TrackModule } from './track/track.module';
import {MongooseModule} from "@nestjs/mongoose";
import { FileModule } from './file/file.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { AuthModule } from './auth/auth.module';
import * as path from 'path'
import {ConfigModule} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    PassportModule.register({session: true}),
    TrackModule,
    FileModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
