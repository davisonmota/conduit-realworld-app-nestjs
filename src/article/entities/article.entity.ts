import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../common/entities/base.entity'
import { User } from '../../user/entities/user.entity'
import { Tag } from './tag.entity'

@Entity({ name: 'articles' })
export class Article extends BaseEntity<Article> {
  @ManyToOne(() => User, (user) => user.articles)
  author: User

  @Column({ type: 'text' })
  title: string

  // @Column({ unique: true })
  // slug: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text' })
  body: string

  @ManyToMany(() => Tag, (tag) => tag.articles, { cascade: true })
  @JoinTable({ name: 'articles_tags' })
  tags?: Tag[]
}
