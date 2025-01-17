export class CurrentUserDto {
  readonly id: string
  readonly username: string

  constructor(data: { id: string; username: string }) {
    Object.assign(this, data)
  }
}
