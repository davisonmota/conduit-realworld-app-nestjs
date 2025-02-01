import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'

export class ListArticlesQueryDto {
  @IsOptional()
  @IsNotEmpty()
  tag?: string

  @IsOptional()
  @IsNotEmpty()
  author?: string

  @IsOptional()
  @IsNotEmpty()
  favorited?: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number = 20

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number = 0
}
