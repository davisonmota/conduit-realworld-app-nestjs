import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator'
import { IsSlug } from '../../../common/validators/is-slug.constraint'

export class AuthorResponse {
  @IsNotEmpty()
  @IsSlug()
  username: string

  @IsNotEmpty()
  @IsString()
  bio: string

  @IsNotEmpty()
  @IsUrl()
  image: string

  @IsNotEmpty()
  @IsBoolean()
  following: boolean
}

export class MultipleArticles {
  @IsNotEmpty()
  @IsSlug()
  slug: string

  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsArray()
  @IsString({ each: true })
  tagList: Array<string>

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date

  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date

  @IsNotEmpty()
  @IsBoolean()
  favorited: boolean

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  favoritesCount: number

  @ValidateNested()
  @Type(() => AuthorResponse)
  author: AuthorResponse
}

export class MultipleArticlesDto {
  @ValidateNested()
  @Type(() => MultipleArticlesDto)
  articles: MultipleArticles[]

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  articlesCount: number
}
