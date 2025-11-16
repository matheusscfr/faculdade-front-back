import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // Mínimo de 10 caracteres
          if (value.length < 10) {
            return false;
          }

          // Pelo menos uma letra maiúscula
          if (!/[A-Z]/.test(value)) {
            return false;
          }

          // Pelo menos uma letra minúscula
          if (!/[a-z]/.test(value)) {
            return false;
          }

          // Pelo menos um número
          if (!/[0-9]/.test(value)) {
            return false;
          }

          // Pelo menos um caractere especial
          if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(value)) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'A senha deve ter no mínimo 10 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial';
        },
      },
    });
  };
}
