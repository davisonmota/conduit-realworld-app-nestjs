import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { Follow } from '../../profile/entities/followers.entyty'
import { BaseEntity } from '../../common/entities/base.entity'
import { Article } from '../../article/entities/article.entity'
import { Comment } from '../../article/entities/comment.entity'

@Entity({ name: 'users' })
export class User extends BaseEntity<User> {
  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'varchar', nullable: true })
  bio: string

  @Column({ type: 'varchar', nullable: true })
  image: string

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[]

  @OneToMany(() => Follow, (follow) => follow.followed)
  followers: Follow[]

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[]

  @ManyToMany(() => Article, (article) => article.favoritedBy)
  @JoinTable()
  favorites?: Article[]

  @OneToMany(() => Comment, (comment) => comment.author, {
    cascade: true,
  })
  comments?: Comment[]
}
