import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CreateArticleDto } from './dto/create-article.dto'
import { GetCurrentUser } from '../common/decorators/current-user.param.decorator'
import { CurrentUserDto } from '../common/dto/current-user.dto'

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Post()
  createArticle(
    @GetCurrentUser() author: CurrentUserDto,
    @Body(new ValidationPipe({ whitelist: true }))
    createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(author.id, createArticleDto)
  }
}
