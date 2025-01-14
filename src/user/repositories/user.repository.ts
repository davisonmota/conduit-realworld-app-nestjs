import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { FindOneOptions, IsNull, Repository } from 'typeorm'

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersTypeOrmRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string) {
    return this.usersTypeOrmRepository.findOneBy({ email })
  }

  save(userEntity: User) {
    return this.usersTypeOrmRepository.save(userEntity)
  }

  async findOneByUserName(username: string) {
    return this.usersTypeOrmRepository.findOneBy({ username })
  }

  findOneById(id: string) {
    return this.usersTypeOrmRepository.findOneBy({
      id: id || IsNull(),
      /**
       * bug: TypeORM returns first item in database when query parameter is undefined instead of null
       * IsNull() resolver
       */
    })
  }

  async findOne(options: FindOneOptions<User>) {
    return await this.usersTypeOrmRepository.findOne(options)
  }

  update(user: User) {
    this.usersTypeOrmRepository.save(user)
  }
}
