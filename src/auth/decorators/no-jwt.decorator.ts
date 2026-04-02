import { SetMetadata } from '@nestjs/common';

export const NO_JWT = 'noJwt';
export const NoJwt = () => SetMetadata(NO_JWT, true);
