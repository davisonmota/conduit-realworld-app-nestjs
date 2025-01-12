export class CurrentUserDto {
  readonly id: string
  readonly username: string
  readonly email: string

  constructor(data: { id: string; email: string; username: string }) {
    Object.assign(this, data)
  }
}
