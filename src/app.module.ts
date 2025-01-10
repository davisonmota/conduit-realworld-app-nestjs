import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/entities/user.entity'
import { AuthModule } from './auth/auth.module'
import { Follow } from './profile/entities/followers.entyty'
import { ProfileModule } from './profile/profile.module'

@Module({
  // TODO: move variables to envFile
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'docker',
      password: 'docker',
      database: 'conduit',
      entities: [User, Follow],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
