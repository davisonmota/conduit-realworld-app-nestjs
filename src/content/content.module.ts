import { Module } from '@nestjs/common'
import { ArticleModule } from './article/article.module'
import { CommentModule } from './comment/comment.module'

@Module({
  imports: [ArticleModule, CommentModule],
})
export class ContentModule {}
