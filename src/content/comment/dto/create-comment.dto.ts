import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'

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
