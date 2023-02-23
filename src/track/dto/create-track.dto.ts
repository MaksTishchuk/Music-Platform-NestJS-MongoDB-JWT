import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateTrackDto {

  @ApiProperty({
    description: 'Track name',
    example: 'Moonlight sonata',
  })
  @IsNotEmpty()
  readonly name

  @ApiProperty({
    description: 'Artist of track',
    example: 'Beethoven',
  })
  @IsNotEmpty()
  readonly artist

  @ApiProperty({
    description: 'Track text',
    example: 'This is track of text',
  })
  readonly text

  @ApiProperty({ type: 'string', format: 'binary' })
  picture: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  audio: any;
}