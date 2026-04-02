import { Expose } from 'class-transformer';

export class GetProfileResponseDto {
  @Expose()
  login!: string;
  @Expose()
  email!: string;
  @Expose()
  age!: number;
  @Expose()
  description!: string;

  constructor(values: GetProfileResponseDto) {
    Object.assign(this, values);
  }
}
