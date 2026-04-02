import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { NO_JWT } from './decorators/no-jwt.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const noJwt = this.reflector.getAllAndOverride<boolean | undefined>(
      NO_JWT,
      [context.getHandler(), context.getClass()],
    );
    if (noJwt) {
      return true;
    }
    return super.canActivate(context);
  }
}
