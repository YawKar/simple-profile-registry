import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  async createUser(user: User) {
    return this.dataSource.manager.save(user);
  }

  async getUser(id: number) {
    return this.dataSource.manager.findOneBy(User, { id });
  }
}
