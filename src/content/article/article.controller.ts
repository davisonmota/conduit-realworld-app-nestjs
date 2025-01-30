import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { CreateArticleDto } from './dto/create-article.dto'
import { GetCurrentUser } from '../../common/decorators/current-user.param.decorator'
import { CurrentUserDto } from '../../common/dto/current-user.dto'
import { ParamSlugDto } from './dto/param-slug.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard'
import { ListArticlesQueryDto } from './dto/list-articles.query.dto'
import { FeedQueryDto } from './dto/feed-query.dto'

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

  @UseGuards(OptionalAuthGuard)
  @Get()
  listArticle(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Query() query: ListArticlesQueryDto,
  ) {
    return this.articleService.findAll(currentUserDto, query)
  }

  @UseGuards(AuthGuard)
  @Get('feed')
  feed(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Query() query: FeedQueryDto,
  ) {
    return this.articleService.feed(currentUserDto, query)
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
  @Delete(':slug')
  deleteArticle(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Param() { slug }: ParamSlugDto,
  ) {
    return this.articleService.delete(currentUserDto, slug)
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

  @UseGuards(OptionalAuthGuard)
  @Get(':slug')
  getArticle(
    @Param() { slug }: ParamSlugDto,
    @GetCurrentUser() currentUserDto: CurrentUserDto,
  ) {
    return this.articleService.getArticle(currentUserDto, slug)
  }
}
