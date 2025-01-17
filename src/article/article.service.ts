import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { ArticleRepository } from './repositories/article.repository'
import { UserRepository } from '../user/repositories/user.repository'
import { Article } from './entities/article.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Tag } from './entities/tag.entity'
import { Repository } from 'typeorm'
import { ArticleResponse } from './dto/article-response.dto'
import { ProfileService } from '../profile/profile.service'
import { randomUUID } from 'node:crypto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { CurrentUserDto } from '../common/dto/current-user.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { Comment } from './entities/comment.entity'
import { CommentRepository } from './repositories/comment.repository'
import { CommentResponse } from './dto/comment-response.dto'

interface ArticleMapInput {
  article: Article
  following: boolean
  favorited: boolean
  favoritesCount: number
}

interface CommentMapInput {
  comment: Comment
  following: boolean
}

@Injectable()
export class ArticleService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
    @InjectRepository(Tag)
    private readonly tagTypeOrmRepository: Repository<Tag>,
  ) {}

  async getArticle(currentUserDto: CurrentUserDto, slug: string) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    })
    if (!article) {
      throw new NotFoundException(`Article not found`)
    }
    if (currentUserDto.username === null) {
      return this.articleMap({
        article,
        favorited: false,
        following: false,
        favoritesCount: await this.countFavorites(article.id),
      })
    }
    const [favorite, following] = await Promise.all([
      await this.isFavorited(currentUserDto.id, slug),
      await this.profileService.isFollowing(
        currentUserDto.username,
        article.author.username,
      ),
    ])
    return this.articleMap({
      article,
      favorited: favorite.isFavorited,
      following: following.isFollowing,
      favoritesCount: await this.countFavorites(article.id),
    })
  }

  async create(authorId: string, { article: articleDto }: CreateArticleDto) {
    const author = await this.userRepository.findOneById(authorId)
    if (!author) {
      throw new NotFoundException('User not found')
    }
    const slug = await this.generateSlug(articleDto.title)
    const newArticle = new Article({
      title: articleDto.title,
      description: articleDto.description,
      body: articleDto.body,
      slug,
      author,
    })

    if (articleDto.tagList) {
      newArticle.tags = await this.createTags(articleDto.tagList)
    }
    const article = await this.articleRepository.create(newArticle)
    return this.articleMap({
      article,
      following: false,
      favorited: false,
      favoritesCount: 0,
    })
  }

  async update(
    currentUser: CurrentUserDto,
    slug: string,
    { article: articleDto }: UpdateArticleDto,
  ) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    })
    if (!article) {
      throw new NotFoundException('Article not found')
    }
    if (article.author.username !== currentUser.username) {
      throw new ForbiddenException()
    }
    const updatedArticle = new Article({
      title: articleDto.title || article.title,
      slug: articleDto.title
        ? await this.generateSlug(articleDto.title)
        : article.slug,
      description: articleDto.description || article.description,
      body: articleDto.body || article.body,
      author: article.author,
    })
    if (articleDto.tagList) {
      updatedArticle.tags = await this.createTags(articleDto.tagList)
    }
    await this.articleRepository.save(updatedArticle)

    const { isFavorited } = await this.isFavorited(currentUser.id, slug)
    return this.articleMap({
      article: updatedArticle,
      following: false,
      favorited: isFavorited,
      favoritesCount: await this.countFavorites(updatedArticle.id),
    })
  }

  async delete(currentUserDto: CurrentUserDto, slug: string) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    })
    if (!article) {
      throw new NotFoundException('Article not found')
    }
    if (article.author.username !== currentUserDto.username) {
      throw new ForbiddenException()
    }

    await this.articleRepository.delete(article)
  }

  async favorite(userId: string, slug: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['favorites'],
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    })

    if (!article) {
      throw new NotFoundException('Article not found')
    }

    const { isFollowing } = await this.profileService.isFollowing(
      user.username,
      article.author.username,
    )

    const favoritesCount = await this.countFavorites(article.id)
    if (
      user.favorites.some((favoriteArticle) => favoriteArticle.slug === slug)
    ) {
      return this.articleMap({
        article,
        favorited: true,
        following: isFollowing,
        favoritesCount,
      })
    }

    user.favorites.push(article)
    await this.userRepository.save(user)

    return this.articleMap({
      article,
      following: isFollowing,
      favorited: true,
      favoritesCount: favoritesCount + 1,
    })
  }

  async unfavorite(userId: string, slug: string) {
    const { isFavorited, user } = await this.isFavorited(userId, slug)
    if (!isFavorited) {
      throw new BadRequestException(
        'User has not added this article to favorites',
      )
    }
    user.favorites = user.favorites.filter(
      (favoriteArticle) => favoriteArticle.slug !== slug,
    )
    await this.userRepository.save(user)

    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    })

    const { isFollowing } = await this.profileService.isFollowing(
      user.username,
      article.author.username,
    )

    return this.articleMap({
      article,
      favorited: false,
      following: isFollowing,
      favoritesCount: await this.countFavorites(article.id),
    })
  }

  async addComment(
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

  async deleteComment(currentUserDto: CurrentUserDto, id: string) {
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

  async countFavorites(articleId: string): Promise<number> {
    return await this.articleRepository.countFavorites(articleId)
  }

  private async createTags(tagList: Array<string>) {
    return await Promise.all(
      tagList.map(async (tagName: string) => {
        let tag = await this.tagTypeOrmRepository.findOne({
          where: { tag: tagName },
        })
        if (!tag) {
          tag = this.tagTypeOrmRepository.create({ tag: tagName })
        }
        return tag
      }),
    )
  }

  async isFavorited(userId: string, slugArticle: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const isFavorited = user.favorites.some(
      (favoriteArticle) => favoriteArticle.slug === slugArticle,
    )

    return { isFavorited, user }
  }

  private async generateSlug(title: string) {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

    const existsArticleWithSlug = await this.articleRepository.findOne({
      where: { slug },
    })
    if (!existsArticleWithSlug) {
      return slug
    }
    return slug.concat('-', randomUUID().slice(0, 8))
  }

  private articleMap({
    article,
    following,
    favorited,
    favoritesCount,
  }: ArticleMapInput): ArticleResponse {
    return {
      article: {
        title: article.title,
        description: article.description,
        body: article.body,
        slug: article.slug,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        tagList: article.tags ? article.tags.map((tag: Tag) => tag.tag) : [],
        favoritesCount,
        favorited,
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
          following,
        },
      },
    }
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
}
