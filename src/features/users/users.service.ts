import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { FindOptionsSelect, IsNull, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from 'src/auth/hash/hash.service';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { UserPatches } from './dtos/patch-user.dto';

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
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private hashService: HashService,
  ) {}

  async findPaginated(query: PaginateQuery) {
    return await paginate(
      query,
      this.usersRepository,
      USER_ENTITY_PAGINATION_CONFIG,
    );
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
    if (selectFields === undefined) {
      return await this.usersRepository.findOneBy({ login });
    }
    return await this.usersRepository.findOne({
      where: { login },
      select: selectFields,
    });
  }

  async softDeleteUser(login: string) {
    return await this.usersRepository.softDelete({ login });
  }

  async patchUser(login: string, userPatches: UserPatches) {
    return await this.usersRepository.update(
      { login, deletedAt: IsNull() },
      userPatches,
    );
  }

  async updateRefreshToken(login: string, newRefreshToken: string) {
    await this.usersRepository.update(
      { login, deletedAt: IsNull() },
      {
        refreshToken: newRefreshToken,
      },
    );
  }

  async doRefreshTokensMatch(login: string, givenRefreshToken: string) {
    return await this.usersRepository.existsBy({
      login,
      refreshToken: givenRefreshToken,
      deletedAt: IsNull(),
    });
  }
}
