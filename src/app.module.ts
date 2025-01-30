import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './customer/user/entities/user.entity'
import { AuthModule } from './auth/auth.module'
import { Follow } from './customer/profile/entities/followers.entyty'
import { Article } from './content/article/entities/article.entity'
import { Tag } from './content/article/entities/tag.entity'
import { Comment } from './content/comment/entities/comment.entity'
import { ContentModule } from './content/content.module'
import { CustomerModule } from './customer/customer.module'

@Module({
  // TODO: move variables to envFile
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'docker',
      password: 'docker',
      database: 'conduit',
      entities: [User, Follow, Article, Tag, Comment],
      synchronize: true,
    }),
    AuthModule,
    CustomerModule,
    ContentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
