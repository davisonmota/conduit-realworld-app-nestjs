import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as process from 'node:process'
import { AuthModule } from './auth/auth.module'
import { Article } from './content/article/entities/article.entity'
import { Tag } from './content/article/entities/tag.entity'
import { Comment } from './content/comment/entities/comment.entity'
import { ContentModule } from './content/content.module'
import { CustomerModule } from './customer/customer.module'
import { Follow } from './customer/profile/entities/followers.entity'
import { User } from './customer/user/entities/user.entity'
import { envSchema } from './env-schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      entities: [User, Follow, Article, Tag, Comment],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    CustomerModule,
    ContentModule,
  ],
})
export class AppModule {}
