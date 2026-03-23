import { Expose } from 'class-transformer';
import { UserEntity } from '../entities/user.entity';

export class CreateUserResponseDto {
  @Expose()
  id!: string;

  constructor(partial: Pick<UserEntity, 'id'>) {
    Object.assign(this, partial);
  }
}
