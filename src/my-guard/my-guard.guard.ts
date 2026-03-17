import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export const Roles = Reflector.createDecorator<string[]>();

@Injectable()
export class MyGuardGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      // then it means that this handler is public (i.e. without required roles)
      return true;
    }
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest<Request>();
    const xroles = req.headersDistinct['x-role'];
    return (
      xroles !== undefined &&
      roles.some((allowedRole) => {
        return xroles.some((suggestedRole) => suggestedRole === allowedRole);
      })
    );
  }
}
