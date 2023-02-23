import {Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import {TrackService} from "./track.service";
import {CreateTrackDto} from "./dto/create-track.dto";
import {ObjectId} from "mongoose";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {UpdateTrackDto} from "./dto/update-track.dto";
import {
  ApiBadRequestResponse, ApiBody, ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse, ApiParam,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";
import {Track} from "./entities/track.entity";
import {Comment} from "./entities/comment.entity";

@ApiTags('Track')
@Controller('tracks')
export class TrackController {

  constructor(private trackService: TrackService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Created track object as response',
    type: Track,
  })
  @ApiBadRequestResponse({ description: 'Track cannot create. Try again!' })
  @ApiSecurity('bearer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Picture and audio dto',
    type: CreateTrackDto,
  })
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
  @ApiOkResponse({
    description: 'Get all tracks'
  })
  getAllTracks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ) {
    return this.trackService.getAllTracks(count, offset)
  }

  @Get('/search')
  @ApiOkResponse({
    description: 'Get tracks by query param'
  })
  searchTracks(@Query('query') query: string,) {
    return this.trackService.searchTracks(query)
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Get track by id',
    type: Track
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Track id',
    schema: { oneOf: [{type: 'ObjectId'}]},
  })
  getOneTrack(@Param('id') id: ObjectId) {
    return this.trackService.getOneTrack(id)
  }

  @Put('/:id')
  @ApiOkResponse({
    description: 'Update track by id'
  })
  @ApiSecurity('bearer')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Track id',
    schema: { oneOf: [{type: 'ObjectId'}]},
  })
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
  @ApiOkResponse({
    description: 'Delete track by id'
  })
  @ApiSecurity('bearer')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Track id',
    schema: { oneOf: [{type: 'ObjectId'}]},
  })
  @UseGuards(AccessTokenGuard)
  deleteTrack(
    @GetCurrentUserId() userId: string,
    @Param('id') id: ObjectId
  ) {
    return this.trackService.deleteTrack(id, userId)
  }

  @Post('/listen/:id')
  @ApiOkResponse({
    description: 'Add listen track quantity'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Track id',
    schema: { oneOf: [{type: 'ObjectId'}]},
  })
  listenTrack(@Param('id') id: ObjectId) {
    return this.trackService.listenTrack(id)
  }

  @Get('/download/:id')
  @ApiOkResponse({
    description: 'Download track'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Track id',
    schema: { oneOf: [{type: 'ObjectId'}]},
  })
  async downloadTrack(@Res() res, @Param('id') id: ObjectId) {
    return res.download(await this.trackService.downloadTrack(id))
  }

  @Post('/comment')
  @ApiCreatedResponse({
    description: 'Created comment object as response',
    type: Comment
  })
  @ApiBadRequestResponse({ description: 'Comment cannot create. Try again!' })
  @ApiSecurity('bearer')
  @UseGuards(AccessTokenGuard)
  addComment(
    @GetCurrentUserId() userId: string,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.trackService.addComment(createCommentDto, userId)
  }

  @Delete('/comment/:id')
  @ApiOkResponse({
    description: 'Delete comment by id'
  })
  @ApiSecurity('bearer')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Comment id',
    schema: { oneOf: [{type: 'ObjectId'}]},
  })
  @UseGuards(AccessTokenGuard)
  deleteComment(
    @GetCurrentUserId() userId: string,
    @Param('id') id: ObjectId
  ) {
    return this.trackService.deleteComment(id, userId)
  }
}
