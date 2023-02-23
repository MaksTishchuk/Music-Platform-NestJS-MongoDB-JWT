import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateTrackDto {
  @ApiProperty({
    description: 'Track name. Not required',
    example: 'Moonlight sonata',
  })
  readonly name

  @ApiProperty({
    description: 'Artist of track. Not required',
    example: 'Beethoven',
  })
  readonly artist

  @ApiProperty({
    description: 'Track text. Not required',
    example: 'This is track of text',
  })
  readonly text
}