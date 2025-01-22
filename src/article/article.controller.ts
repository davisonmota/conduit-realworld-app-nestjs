import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
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
import { CreateCommentDto } from './dto/create-comment.dto'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { ListArticlesDto } from './dto/list-articles.dto'

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
    @Query() query: ListArticlesDto,
  ) {
    return this.articleService.findAll(currentUserDto, query)
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

  @UseGuards(AuthGuard)
  @Post(':slug/comments')
  createComment(
    @Param() { slug }: ParamSlugDto,
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Body(new ValidationPipe({ whitelist: true }))
    createCommentDto: CreateCommentDto,
  ) {
    return this.articleService.addComment(
      currentUserDto,
      slug,
      createCommentDto,
    )
  }

  @UseGuards(AuthGuard)
  @Delete('/comments/:id')
  deleteComment(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser() currentUserDto: CurrentUserDto,
  ) {
    return this.articleService.deleteComment(currentUserDto, id)
  }
}
