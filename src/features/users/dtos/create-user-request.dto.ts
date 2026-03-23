import {
  IsEmail,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateUserRequestDto {
  @Length(1, 16)
  @IsString()
  login!: string;
  @IsEmail()
  email!: string;
  @MaxLength(20)
  @IsStrongPassword({ minLength: 8 })
  password!: string;
  @Max(150)
  @Min(1)
  @IsNumber({ maxDecimalPlaces: 0 })
  age!: number;
  @MaxLength(1000)
  @IsString()
  description!: string;
}
