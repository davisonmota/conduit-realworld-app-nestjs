import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CurrentUserDto } from '../../common/dto/current-user.dto'
import { ProfileService } from '../../customer/profile/profile.service'
import { UserRepository } from '../../customer/user/repositories/user.repository'
import { ArticleRepository } from '../article/repositories/article.repository'
import { CommentResponse } from './dto/comment-response.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { Comment } from './entities/comment.entity'
import { CommentRepository } from './repositories/comment.repository'

interface CommentMapInput {
  comment: Comment
  following: boolean
}

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly profileService: ProfileService,
  ) {}

  async add(
    currentUserDto: CurrentUserDto,
    slug: string,
    createCommentDto: CreateCommentDto,
  ) {
    const author = await this.userRepository.findOne({
      where: { id: currentUserDto.id },
    })
    if (!author) {
      throw new NotFoundException('User not found')
    }
    const article = await this.articleRepository.findOne({ where: { slug } })
    if (!article) {
      throw new NotFoundException('Article not found')
    }
    const comment = new Comment({
      body: createCommentDto.comment.body,
      author,
      article,
    })
    await this.commentRepository.save(comment)
    return this.commentMap({ comment, following: false })
  }

  async getCommentsByArticleSlug(currentUserDto: CurrentUserDto, slug: string) {
    const comments = await this.articleRepository.getCommentsByArticleSlug(slug)
    return this.commentsMap({ comments, currentUser: currentUserDto })
  }

  async delete(currentUserDto: CurrentUserDto, id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    })
    if (!comment) {
      throw new NotFoundException('Comment not found')
    }
    if (comment.author.username !== currentUserDto.username) {
      throw new ForbiddenException()
    }

    await this.commentRepository.delete(comment.id)
  }

  private commentMap({ comment, following }: CommentMapInput): CommentResponse {
    return {
      comment: {
        id: comment.id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        body: comment.body,
        author: {
          username: comment.author.username,
          bio: comment.author.bio,
          image: comment.author.image,
          following,
        },
      },
    }
  }

  private async commentsMap({
    comments,
    currentUser,
  }: {
    comments: Comment[]
    currentUser: CurrentUserDto
  }) {
    const commentsMapped = await Promise.all(
      comments.map(async (comment) => {
        let following = false
        if (currentUser.id) {
          const { isFollowing } = await this.profileService.isFollowing(
            currentUser.username,
            comment.author.username,
          )
          following = isFollowing
        }
        return {
          id: comment.id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
          body: comment.body,
          author: {
            username: comment.author.username,
            bio: comment.author.bio,
            image: comment.author.image,
            following,
          },
        }
      }),
    )
    return { comments: commentsMapped }
  }
}
