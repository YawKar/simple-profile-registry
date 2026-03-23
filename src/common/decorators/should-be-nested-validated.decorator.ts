import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';

export const ShouldBeNestedValidated = (
  classConstructor: () => NewableFunction,
) =>
  applyDecorators(
    IsDefined(),
    IsNotEmptyObject(),
    ValidateNested(),
    Type(classConstructor),
  );
