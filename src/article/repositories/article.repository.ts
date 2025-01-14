import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { Article } from '../entities/article.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(Article)
    private readonly articlesTypeOrmRepository: Repository<Article>,
  ) {}

  async create(article: Article) {
    return await this.articlesTypeOrmRepository.save(article)
  }

  async findOne(options: FindOneOptions<Article>) {
    return await this.articlesTypeOrmRepository.findOne(options)
  }
}
