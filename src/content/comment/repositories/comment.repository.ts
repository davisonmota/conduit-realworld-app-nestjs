import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
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

  findOne(options: FindOneOptions<Comment>) {
    return this.commentRepository.findOne(options)
  }
}
