import { BaseEntity } from '../../common/entities/base.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { Article } from './article.entity'
import { User } from '../../user/entities/user.entity'

@Entity({ name: 'comments' })
export class Comment extends BaseEntity<Comment> {
  @Column({ type: 'text', nullable: false })
  body: string

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  article: Article

  @ManyToOne(() => User, (author) => author.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: User
}
