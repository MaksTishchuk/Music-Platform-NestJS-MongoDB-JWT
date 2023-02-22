import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'
import {fileExistsAsync} from "tsconfig-paths/lib/filesystem";

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image'

}

@Injectable()
export class FileService {

  createFile(type: FileType, file): string {
    try {
      const fileExtension = file.originalname.split('.').pop()
      const fileName = uuid.v4() + '.' + fileExtension
      const filePath = path.resolve(__dirname, '..', 'static', type)
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true})
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
      return type + '/' + fileName
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  removeFile(filePath: string) {
    const fullFilePath = path.resolve(__dirname, '..', 'static', filePath)
    try {
      fs.unlinkSync(fullFilePath)
    } catch (err) {console.log('File with this path was not found!')}
  }

  generateTrackPath(filePath: string) {
    return path.resolve(__dirname, '..', 'static', filePath)
  }
}
