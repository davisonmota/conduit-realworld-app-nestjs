import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Article } from './article.entity'

@Entity({ name: 'tags' })
export class Tag {
  constructor(data: Partial<Tag>) {
    Object.assign(this, data)
  }

  @PrimaryGeneratedColumn()
  id: string

  @Column({ unique: true })
  tag: string

  @ManyToMany(() => Article, (article) => article.tags)
  articles?: Article[]
}
