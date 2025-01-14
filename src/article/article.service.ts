import {
  ConflictException,
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
import { ArticleResponse } from './entities/article-response.dto'

@Injectable()
export class ArticleService {
  constructor(
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
    const slug = this.generateSlug(articleDto.title)
    const existsArticle = await this.articleRepository.findOne({
      where: { slug, author },
    })
    if (existsArticle) {
      throw new ConflictException(
        'An article with this title already exists for the same author',
      )
    }

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

    return this.articleMap(article)
  }

  private generateSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  private articleMap(
    article: Article,
    following: boolean = false,
  ): ArticleResponse {
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
        favorited: false,
        favoritesCount: 0,
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
