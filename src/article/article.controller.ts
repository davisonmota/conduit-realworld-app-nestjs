import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CreateArticleDto } from './dto/create-article.dto'
import { GetCurrentUser } from '../common/decorators/current-user.param.decorator'
import { CurrentUserDto } from '../common/dto/current-user.dto'
import { ParamSlugDto } from './dto/param-slug.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

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

  @UseGuards(AuthGuard)
  @Put(':slug')
  updateArticle(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Param() { slug }: ParamSlugDto,
    @Body(new ValidationPipe({ whitelist: true }))
    updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(currentUserDto, slug, updateArticleDto)
  }

  @UseGuards(AuthGuard)
  @Post(':slug/favorite')
  favoriteArticle(
    @Param() { slug }: ParamSlugDto,
    @GetCurrentUser() currentUserDto: CurrentUserDto,
  ) {
    return this.articleService.favorite(currentUserDto.id, slug)
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/favorite')
  unfavoriteArticle(
    @Param() { slug }: ParamSlugDto,
    @GetCurrentUser() currentUserDto: CurrentUserDto,
  ) {
    return this.articleService.unfavorite(currentUserDto.id, slug)
  }
}
