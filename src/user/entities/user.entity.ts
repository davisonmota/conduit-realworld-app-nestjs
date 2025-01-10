import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { randomUUID } from 'node:crypto'
import { Follow } from '../../profile/entities/followers.entyty'

// TODO: create base entity

@Entity({ name: 'users' })
export class User {
  constructor(data: Partial<User>) {
    Object.assign(this, data)
    this.id = this.id || randomUUID()
  }

  @PrimaryColumn({ type: 'uuid' })
  id: string

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

  @Column({ type: 'timestamp' })
  created_at: Date

  @BeforeInsert()
  beforeInsert() {
    this.created_at = this.created_at || new Date()
  }

  @UpdateDateColumn()
  updated_at: Date

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date()
  }
}
