export class UserResponseDto {
  user: {
    username: string
    email: string
    bio: string | null
    image: string | null
    token: string
  }
}
