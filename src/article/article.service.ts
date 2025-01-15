import { Injectable, NotFoundException } from '@nestjs/common'
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

interface ArticleMapInput {
  article: Article
  following: boolean
  favorited: boolean
  favoritesCount?: number
}

@Injectable()
export class ArticleService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository,
    @InjectRepository(Tag)
    private readonly tagTypeOrmRepository: Repository<Tag>,
  ) {}

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
      newArticle.tags = await Promise.all(
        articleDto.tagList.map(async (tagName: string) => {
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

    const article = await this.articleRepository.create(newArticle)

    return this.articleMap({ article, following: false, favorited: false })
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

  async countFavorites(articleId: string): Promise<number> {
    return await this.articleRepository.countFavorites(articleId)
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
    // TODO: create rules slug, favorited, favoritesCount, falowing
    return {
      article: {
        title: article.title,
        description: article.description,
        body: article.body,
        slug: article.slug,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        tagList: article.tags ? article.tags.map((tag: Tag) => tag.tag) : [],
        favoritesCount: favoritesCount || 0,
        favorited: favorited || false,
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
          following,
        },
      },
    }
  }
}
