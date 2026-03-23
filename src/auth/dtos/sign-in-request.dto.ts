import { IsString } from 'class-validator';

export class SignInRequestDto {
  @IsString()
  login!: string;
  @IsString()
  password!: string;
}
