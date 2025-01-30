import { IsNumber, IsOptional, Min } from 'class-validator'

export class TagsQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number
}
