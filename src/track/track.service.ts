import {HttpException, HttpStatus, Injectable, StreamableFile} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Track, TrackDocument} from "./entities/track.entity";
import {Model, ObjectId} from "mongoose";
import {Comment, CommentDocument} from "./entities/comment.entity";
import {CreateTrackDto} from "./dto/create-track.dto";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {FileService, FileType} from "../file/file.service";
import {User, UserDocument} from "../auth/entities/user.entity";
import {AuthService} from "../auth/auth.service";
import {createReadStream} from "fs";
import {UpdateTrackDto} from "./dto/update-track.dto";

@Injectable()
export class TrackService {

  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
    private authService: AuthService
  ) {}

  async createTrack(createTrackDto: CreateTrackDto, picture, audio, userId: string): Promise<Track> {
    const user = await this.authService.getUserById(userId)
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture)
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio)
    const track = await this.trackModel.create(
      {...createTrackDto, listens: 0, picture: picturePath, audio: audioPath, addedTrack: user.id}
    )
    user.tracks.push(track.id)
    await user.save()
    return track
  }

  async getAllTracks(count: number = 10, offset: number = 0): Promise<Track[]> {
    const tracks = await this.trackModel.find().skip(offset).limit(count).populate('addedTrack', '_id username email')
    return tracks
  }

  async searchTracks(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: {$regex: new RegExp(query, 'i')}
    }).populate('addedTrack', '_id username email')
    return tracks
  }

  async getOneTrack(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById({_id: id}).populate([
      {path: 'comments', select: '_id text author createdAt', populate: {path: 'author', select: '_id username email'}},
      {path: 'addedTrack', select: '_id username email'}
    ])
    return track
  }

  async updateTrack(id: ObjectId, updateTrackDto: UpdateTrackDto, picture, audio, userId: string) {
    const track = await this.trackModel.findOne({_id: id, addedTrack: userId})
    if (!track) throw new HttpException(`Track with ID "${id}" has not been updated!`, HttpStatus.BAD_REQUEST)
    if (picture) {
      this.fileService.removeFile(track.picture)
      picture = this.fileService.createFile(FileType.IMAGE, picture)
    }
    if (audio) {
      this.fileService.removeFile(track.audio)
      audio = this.fileService.createFile(FileType.AUDIO, audio)
    }

    await this.trackModel.updateOne(
      {_id: id, addedTrack: userId},
      {
        name: typeof updateTrackDto.name !== 'undefined' ? updateTrackDto.name : track.name,
        artist: typeof updateTrackDto.artist !== 'undefined' ? updateTrackDto.artist : track.artist,
        text: typeof updateTrackDto.text !== 'undefined' ? updateTrackDto.text : track.text,
        listens: track.listens,
        picture: typeof picture !== 'undefined' ? picture : track.picture,
        audio: typeof audio !== 'undefined' ? audio : track.audio
      }
    )
    return {'success': true, 'message': `Track with ID "${id}" has been updated!`}
  }

  async deleteTrack(id: ObjectId, userId: string) {
    const track = await this.trackModel.findOneAndDelete({id, addedTrack: userId})
    if (!track) throw new HttpException(`Track with ID "${id}" has not been deleted!`, HttpStatus.BAD_REQUEST)
    for (const comment in track.comments) {
      const thisComment = await this.commentModel.findOneAndDelete({_id: track.comments[comment]})
      await this.userModel.updateOne({_id: thisComment.author}, {$pull:{"comments": track.comments[comment] }})
    }
    await this.userModel.updateOne({_id: track.addedTrack}, {$pull:{"tracks": track.id }})
    this.fileService.removeFile(track.picture)
    this.fileService.removeFile(track.audio)
    return {'success': true, 'message': `Track with ID "${id}" has been deleted!`}
  }

  async listenTrack(id: ObjectId): Promise<void> {
    const track = await this.trackModel.findById(id)
    track.listens += 1
    track.save()
  }

  async downloadTrack(id: ObjectId): Promise<string> {
    const track = await this.trackModel.findById(id)
    return this.fileService.generateTrackPath(track.audio)
  }

  async addComment(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const {text, trackId} = createCommentDto
    const user = await this.authService.getUserById(userId)
    const track = await this.trackModel.findById(trackId)
    const comment = await this.commentModel.create({text, track: track.id, author: user.id})
    track.comments.push(comment.id)
    await track.save()
    user.comments.push(comment.id)
    await user.save()
    return comment
  }

  async deleteComment(id: ObjectId, userId: string) {
    const comment = await this.commentModel.findOneAndDelete({id, author: userId})
    if (!comment) throw new HttpException(`Comment with ID "${id}" has not been deleted!`, HttpStatus.BAD_REQUEST)
    await this.userModel.updateOne({_id: comment.author}, {$pull:{"comments": comment.id }})
    await this.trackModel.updateOne({_id: comment.track}, {$pull:{"comments": comment.id }})
    return {'success': true, 'message': `Comment with ID "${id}" has been deleted!`}
  }
}
