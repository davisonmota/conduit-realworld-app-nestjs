import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { Article } from '../entities/article.entity'
import { Injectable } from '@nestjs/common'
import { User } from '../../user/entities/user.entity'

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
}
