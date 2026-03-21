import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async createUser(user: User) {
    await this.repository.save(user);
  }

  async getUser(id: number) {
    return this.repository.findOneBy({ id });
  }
}
