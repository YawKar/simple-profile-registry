import {
  createParamDecorator,
  ExecutionContext,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { Request } from 'express';

const User: (
  data: string,
  ...pipes: (PipeTransform | Type<PipeTransform>)[]
) => ParameterDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request?.user?.[data];
  },
);

export const CurrentUserLogin = (
  ...pipes: (PipeTransform | Type<PipeTransform>)[]
) => User('login', ...pipes);
