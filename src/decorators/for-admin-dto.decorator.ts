import { ValidationOptions, registerDecorator } from 'class-validator';
import { forAdmin } from '../../constant';

export function ForAdmin(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: forAdmin,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate() {
          return true;
        },
      },
    });
  };
}
