import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'is-slug' })
class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (typeof value !== 'string') {
      return false
    }
    const slugRegex = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/
    const isMatch = slugRegex.test(value)
    return isMatch
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be a string with only lowercase latter, numbers and hyphens, without spaces.`
  }
}

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    return registerDecorator({
      target: object.constructor,
      options: validationOptions,
      constraints: [],
      validator: IsSlugConstraint,
      propertyName,
    })
  }
}
