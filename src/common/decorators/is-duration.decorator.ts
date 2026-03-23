import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import ms, { StringValue } from 'ms';

class IsDurationConstraint implements ValidatorConstraintInterface {
  validate(value: any): Promise<boolean> | boolean {
    if (typeof value !== 'string') {
      return false;
    }

    try {
      // it throws only in bad cases
      ms(value as StringValue);
    } catch {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Duration ($value) is invalid (e.g., 60s, 15m, 1h, 1w)';
  }
}

export const IsDuration =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      async: false,
      constraints: [],
      options: validationOptions,
      validator: IsDurationConstraint,
    });
  };
