import { Module } from '@nestjs/common';
import { TrackModule } from './track/track.module';
import {MongooseModule} from "@nestjs/mongoose";
import { FileModule } from './file/file.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { AuthModule } from './auth/auth.module';
import * as path from 'path'

@Module({
  imports: [
    ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
    MongooseModule.forRoot(
      'mongodb+srv://maks:Qwerty@music-platform.rw8iq3g.mongodb.net/music-platform?retryWrites=true&w=majority'
    ),
    TrackModule,
    FileModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
