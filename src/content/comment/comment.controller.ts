import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard'
import { GetCurrentUser } from '../../common/decorators/current-user.param.decorator'
import { CurrentUserDto } from '../../common/dto/current-user.dto'
import { ParamSlugDto } from '../article/dto/param-slug.dto'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(OptionalAuthGuard)
  @Get('articles/:slug/comments')
  getComment(
    @Param() { slug }: ParamSlugDto,
    @GetCurrentUser() currentUserDto: CurrentUserDto,
  ) {
    return this.commentService.getCommentsByArticleSlug(currentUserDto, slug)
  }

  @UseGuards(AuthGuard)
  @Post('articles/:slug/comments')
  createComment(
    @Param() { slug }: ParamSlugDto,
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Body(new ValidationPipe({ whitelist: true }))
    createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.add(currentUserDto, slug, createCommentDto)
  }

  @UseGuards(AuthGuard)
  @Delete('articles/comments/:id')
  deleteComment(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser() currentUserDto: CurrentUserDto,
  ) {
    return this.commentService.delete(currentUserDto, id)
  }
}
