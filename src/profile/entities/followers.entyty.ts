import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('followers')
export class Follow {
  @PrimaryGeneratedColumn()
  id: string

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  follower: User

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  followed: User

  @CreateDateColumn({ type: 'timestamp' })
  followed_at: Date
}
