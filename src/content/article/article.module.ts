import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileModule } from '../../customer/profile/profile.module'
import { User } from '../../customer/user/entities/user.entity'
import { UserModule } from '../../customer/user/user.module'
import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'
import { Article } from './entities/article.entity'
import { Tag } from './entities/tag.entity'
import { ArticleRepository } from './repositories/article.repository'
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
