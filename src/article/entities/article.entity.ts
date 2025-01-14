import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm'
import { BaseEntity } from '../../common/entities/base.entity'
import { User } from '../../user/entities/user.entity'
import { Tag } from './tag.entity'

@Entity({ name: 'articles' })
@Unique(['author', 'slug'])
export class Article extends BaseEntity<Article> {
  @ManyToOne(() => User, (user) => user.articles, { nullable: false })
  author: User

  @Column({ type: 'text', nullable: false })
  title: string

  @Column({ type: 'text', nullable: false })
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
}
