import { IsSlug } from '../../common/validators/is-slug.constraint'

export class ParamSlugDto {
  @IsSlug()
  slug: string
}
