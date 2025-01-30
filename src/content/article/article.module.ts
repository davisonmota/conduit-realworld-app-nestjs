import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { ArticleRepository } from './repositories/article.repository'
import { Article } from './entities/article.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from './entities/tag.entity'
import { UserModule } from '../../customer/user/user.module'
import { ProfileModule } from '../../customer/profile/profile.module'
import { User } from '../../customer/user/entities/user.entity'
import { TagController } from './tag.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User, Tag]),
    UserModule,
    ProfileModule,
  ],
  controllers: [ArticleController, TagController],
  providers: [ArticleService, ArticleRepository],
  exports: [ArticleRepository],
})
export class ArticleModule {}
