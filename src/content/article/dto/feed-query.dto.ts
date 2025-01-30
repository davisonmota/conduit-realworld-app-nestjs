import { IsNumber, IsOptional, Min } from 'class-validator'

export class FeedQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number = 20

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number = 0
}
