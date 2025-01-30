import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { Article } from '../entities/article.entity'
import { Injectable } from '@nestjs/common'
import { User } from '../../../customer/user/entities/user.entity'
import { ListArticlesQueryDto } from '../dto/list-articles.query.dto'
import { FeedQueryDto } from '../dto/feed-query.dto'

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Article)
    private readonly articlesTypeOrmRepository: Repository<Article>,
  ) {}

  async create(article: Article) {
    return await this.articlesTypeOrmRepository.save(article)
  }

  async findOne(options: FindOneOptions<Article>) {
    return await this.articlesTypeOrmRepository.findOne(options)
  }

  async countFavorites(articleId: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .innerJoin('users.favorites', 'articles', 'articles.id = :articleId', {
        articleId,
      })
      .getCount()
  }

  async save(updatedArticle: Article) {
    return this.articlesTypeOrmRepository.save(updatedArticle)
  }

  async delete(article: Article) {
    await this.articlesTypeOrmRepository.delete({ id: article.id })
  }

  async findAll({
    tag,
    author,
    favorited,
    limit = 20,
    offset = 0,
  }: ListArticlesQueryDto) {
    const qb = this.articlesTypeOrmRepository.createQueryBuilder('article')

    qb.leftJoinAndSelect('article.author', 'author')
    qb.leftJoinAndSelect('article.tags', 'tags')

    if (tag) {
      qb.andWhere('tags.tag = :tag', { tag })
    }

    if (author) {
      qb.andWhere('author.username = :author', { author })
    }

    if (favorited) {
      qb.leftJoinAndSelect('article.favoritedBy', 'favoritedBy')
      qb.andWhere('favoritedBy.username = :favorited', { favorited })
    }

    qb.orderBy('article.created_at', 'DESC')

    qb.take(limit).skip(offset)

    const [articles, articlesCount] = await qb.getManyAndCount()

    return {
      articles,
      articlesCount,
    }
  }

  async findFeed(
    currentUserId: string,
    { limit = 20, offset = 0 }: FeedQueryDto,
  ) {
    const qb = this.articlesTypeOrmRepository.createQueryBuilder('article')
    qb.leftJoinAndSelect('article.author', 'author')
    qb.leftJoinAndSelect('article.tags', 'tags')

    qb.innerJoin(
      'followers',
      'followers',
      'followers.followerId = :currentUserId AND followers.followedId = article.authorId',
      { currentUserId },
    )

    qb.orderBy('article.created_at', 'DESC')

    qb.skip(offset).take(limit)

    const [articles, articlesCount] = await qb.getManyAndCount()
    return {
      articles,
      articlesCount,
    }
  }

  async getCommentsByArticleSlug(slug: string) {
    const article = await this.articlesTypeOrmRepository.findOne({
      where: { slug },
      relations: ['comments', 'comments.author'],
    })
    return article ? article.comments : []
  }
}
