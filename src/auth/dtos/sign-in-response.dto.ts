import { Expose } from 'class-transformer';

export class SignInResponseDto {
  @Expose()
  access_token!: string;
  @Expose()
  refresh_token!: string;

  constructor(values: SignInResponseDto) {
    Object.assign(this, values);
  }
}
