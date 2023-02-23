import {IsNotEmpty} from "class-validator";

export class CreateTrackDto {
  @IsNotEmpty()
  readonly name

  @IsNotEmpty()
  readonly artist

  readonly text
}