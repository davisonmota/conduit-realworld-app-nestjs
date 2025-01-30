import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class UpdateArticle {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  body?: string

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tagList?: Array<string>
}
export class UpdateArticleDto {
  @ValidateNested()
  @Type(() => UpdateArticle)
  article: UpdateArticle
}
