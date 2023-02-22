import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Track, TrackSchema} from "./entities/track.entity";
import {Comment, CommentSchema} from "./entities/comment.entity";
import {FileService} from "../file/file.service";
import {User, UserSchema} from "../auth/entities/user.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Track.name, schema: TrackSchema},
      {name: Comment.name, schema: CommentSchema},
      {name: User.name, schema: UserSchema}
    ]),
    AuthModule
  ],
  controllers: [TrackController],
  providers: [TrackService, FileService]
})
export class TrackModule {}
