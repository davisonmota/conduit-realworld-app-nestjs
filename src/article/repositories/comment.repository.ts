import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Comment } from '../entities/comment.entity'

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async save(comment: Comment) {
    return this.commentRepository.save(comment)
  }

  async delete(commentId: string): Promise<void> {
    await this.commentRepository.delete({ id: commentId })
  }
}
