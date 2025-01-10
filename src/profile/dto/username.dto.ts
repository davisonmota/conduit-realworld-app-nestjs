import { IsSlug } from '../../common/validators/is-slug.constraint'

export class UsernameDto {
  @IsSlug()
  username: string
}
