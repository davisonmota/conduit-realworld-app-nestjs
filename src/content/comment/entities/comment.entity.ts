import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../common/entities/base.entity'
import { User } from '../../../customer/user/entities/user.entity'
import { Article } from '../../article/entities/article.entity'

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
