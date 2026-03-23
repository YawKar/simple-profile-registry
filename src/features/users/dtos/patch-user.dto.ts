import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ShouldBeNestedValidated } from 'src/common/decorators/should-be-nested-validated.decorator';

export class UserPatches {
  @Max(150)
  @Min(1)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsOptional()
  age?: number;
  @MaxLength(1000)
  @IsString()
  @IsOptional()
  description?: string;
}

export class PatchUserDto {
  @ShouldBeNestedValidated(() => UserPatches)
  patches!: UserPatches;
}
