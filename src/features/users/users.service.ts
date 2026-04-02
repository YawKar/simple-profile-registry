import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { FindOptionsSelect } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from 'src/common/hash/hash.service';
import { PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { UserPatches } from './dtos/patch-user.dto';
import { UsersRepository } from './users.repository';

export const USER_ENTITY_PAGINATION_CONFIG: PaginateConfig<UserEntity> = {
  sortableColumns: ['login', 'email'],
  searchableColumns: ['login', 'email'],
  select: ['login', 'email', 'age', 'description'],
  defaultSortBy: [['login', 'ASC']],
  nullSort: 'last',
};

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private hashService: HashService,
  ) {}

  async findPaginated(query: PaginateQuery) {
    return await this.usersRepository.findPaginated(query);
  }

  async createNewUser(createUserRequestDto: CreateUserRequestDto) {
    return await this.usersRepository.save(
      new UserEntity({
        ...createUserRequestDto,
        hashedPassword: await this.hashService.hash(
          createUserRequestDto.password,
        ),
      }),
    );
  }

  async findOneByLogin(
    login: string,
    selectFields?: FindOptionsSelect<UserEntity>,
  ) {
    return await this.usersRepository.findOne(
      login,
      selectFields && { login: true, ...selectFields },
    );
  }

  async softDeleteUser(login: string) {
    return await this.usersRepository.softDeleteUser(login);
  }

  async patchUser(login: string, userPatches: UserPatches) {
    return await this.usersRepository.update(login, false, userPatches);
  }

  async updateRefreshToken(login: string, newRefreshToken: string) {
    await this.usersRepository.update(login, false, {
      hashedRefreshToken: await this.hashService.hash(newRefreshToken),
    });
  }

  async doRefreshTokensMatch(login: string, givenRefreshToken: string) {
    const user = await this.findOneByLogin(login, { hashedRefreshToken: true });
    if (!user) {
      return false;
    }
    return await this.hashService.compare(
      givenRefreshToken,
      user.hashedRefreshToken ?? '',
    );
  }

  async invalidateRefreshToken(login: string) {
    await this.usersRepository.update(login, true, {
      login,
      hashedRefreshToken: null,
    });
  }
}
