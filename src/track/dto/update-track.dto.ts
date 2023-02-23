import {IsString} from "class-validator";

export class UpdateTrackDto {
  readonly name
  readonly artist
  readonly text
}