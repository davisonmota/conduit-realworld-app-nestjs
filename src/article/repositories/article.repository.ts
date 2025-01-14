import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Article } from '../entities/article.entity'
import { CreateArticleDto } from '../dto/create-article.dto'
import { Injectable } from '@nestjs/common'
import { Tag } from '../entities/tag.entity'

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(Article)
    private readonly articlesTypeOrmRepository: Repository<Article>,
  ) {}

  async create(article: Article) {
    return await this.articlesTypeOrmRepository.save(article)
  }
}
