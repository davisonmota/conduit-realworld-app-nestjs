import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { BaseEntity } from '../../../common/entities/base.entity'
import { User } from '../../../customer/user/entities/user.entity'
import { Comment } from '../../comment/entities/comment.entity'
import { Tag } from './tag.entity'

@Entity({ name: 'articles' })
export class Article extends BaseEntity<Article> {
  @ManyToOne(() => User, (user) => user.articles, { nullable: false })
  author: User

  @Column({ type: 'text', nullable: false })
  title: string

  @Column({ type: 'text', nullable: false, unique: true })
  slug: string

  @Column({ type: 'text', nullable: false })
  description: string

  @Column({ type: 'text', nullable: false })
  body: string

  @ManyToMany(() => Tag, (tag) => tag.articles, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'articles_tags' })
  tags?: Tag[]

  @ManyToMany(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  favoritedBy?: User[]

  @OneToMany(() => Comment, (comment) => comment.article, {
    cascade: true,
  })
  comments?: Comment[]
}
