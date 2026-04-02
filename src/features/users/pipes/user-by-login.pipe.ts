import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserByLoginPipe implements PipeTransform<
  string,
  Promise<UserEntity>
> {
  constructor(private readonly usersService: UsersService) {}

  async transform(login: string) {
    const user = await this.usersService.findOneByLogin(login);
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }
}
