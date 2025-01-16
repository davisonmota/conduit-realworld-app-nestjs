import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class CreateComment {
  @IsNotEmpty()
  @IsString()
  body: string
}

export class CreateCommentDto {
  @ValidateNested()
  @Type(() => CreateComment)
  comment: CreateComment
}
