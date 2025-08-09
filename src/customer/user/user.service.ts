import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcryptjs from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user.response.dto'
import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const [userEmailExist, userNameExits] = await Promise.all([
      this.userRepository.findOneByEmail(createUserDto.user.email),
      this.userRepository.findOneByUserName(createUserDto.user.username),
    ])
    if (userEmailExist) {
      throw new BadRequestException('Email already exists')
    }
    if (userNameExits) {
      throw new BadRequestException('Username already exists')
    }

    const user = new User({
      email: createUserDto.user.email,
      username: createUserDto.user.username,
      password: await bcryptjs.hash(
        createUserDto.user.password,
        this.configService.get<number>('HASH_SALT_JWT'),
      ),
    })
    const newUser = await this.userRepository.save(user)
    return this.userMap(newUser)
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOneById(id)
    this.thrownExceptionIfUserNotFound(user)
    return this.userMap(user)
  }

  async updateById(id, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findOneById(id)
    this.thrownExceptionIfUserNotFound(user)

    user = new User({
      ...user,
      ...updateUserDto.user,
    })

    this.userRepository.update(user)
    return this.userMap(user)
  }

  private thrownExceptionIfUserNotFound(user: User) {
    if (!user) {
      throw new BadRequestException('User not found')
    }
  }

  private userMap(user: User): UserResponseDto {
    return {
      user: {
        token: this.jwtService.sign({ sub: user.id, username: user.username }, {
          secret: this.configService.get('SECRET_JWT'),
        }),
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    }
  }
}
