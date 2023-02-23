import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post, Put, Query, Res, StreamableFile, UploadedFiles, UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {TrackService} from "./track.service";
import {CreateTrackDto} from "./dto/create-track.dto";
import {ObjectId} from "mongoose";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {UpdateTrackDto} from "./dto/update-track.dto";

@Controller('tracks')
export class TrackController {

  constructor(private trackService: TrackService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]))
  createTrack(
    @GetCurrentUserId() userId: string,
    @UploadedFiles() files,
    @Body() createTrackDto: CreateTrackDto
  ) {
    const {picture, audio} = files
    return this.trackService.createTrack(createTrackDto, picture[0], audio[0], userId)
  }

  @Get()
  getAllTracks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ) {
    return this.trackService.getAllTracks(count, offset)
  }

  @Get('/search')
  searchTracks(@Query('query') query: string,) {
    return this.trackService.searchTracks(query)
  }

  @Get('/:id')
  getOneTrack(@Param('id') id: ObjectId) {
    return this.trackService.getOneTrack(id)
  }

  @Put('/:id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]))
  updateTrack(
    @Param('id') id: ObjectId,
    @GetCurrentUserId() userId: string,
    @UploadedFiles() files,
    @Body() updateTrackDto: UpdateTrackDto
  ) {
    let picture = typeof files.picture !== 'undefined' ? files.picture[0] : undefined
    let audio = typeof files.audio !== 'undefined' ? files.audio[0] : undefined
    return this.trackService.updateTrack(id, updateTrackDto, picture, audio, userId)
  }

  @Delete('/:id')
  @UseGuards(AccessTokenGuard)
  deleteTrack(
    @GetCurrentUserId() userId: string,
    @Param('id') id: ObjectId
  ) {
    return this.trackService.deleteTrack(id, userId)
  }

  @Post('/listen/:id')
  listenTrack(@Param('id') id: ObjectId) {
    return this.trackService.listenTrack(id)
  }

  @Get('/download/:id')
  async downloadTrack(@Res() res, @Param('id') id: ObjectId) {
    return res.download(await this.trackService.downloadTrack(id))
  }

  @Post('/comment')
  @UseGuards(AccessTokenGuard)
  addComment(
    @GetCurrentUserId() userId: string,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.trackService.addComment(createCommentDto, userId)
  }

  @Delete('/comment/:id')
  @UseGuards(AccessTokenGuard)
  deleteComment(
    @GetCurrentUserId() userId: string,
    @Param('id') id: ObjectId
  ) {
    return this.trackService.deleteComment(id, userId)
  }
}
