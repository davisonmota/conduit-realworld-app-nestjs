import { Controller, Get, Query } from '@nestjs/common'
import { ArticleService } from './article.service'
import { TagsQueryDto } from './dto/tags-query.dto'

@Controller()
export class TagController {
  constructor(private readonly articleService: ArticleService) {}
  @Get('tags')
  getTags(@Query() query: TagsQueryDto) {
    return this.articleService.getTag(query)
  }
}
