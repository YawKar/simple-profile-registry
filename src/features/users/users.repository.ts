import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { DataSource, FindOptionsSelect, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

export const USER_ENTITY_PAGINATION_CONFIG: PaginateConfig<UserEntity> = {
  sortableColumns: ['login', 'email'],
  searchableColumns: ['login', 'email'],
  select: ['login', 'email', 'age', 'description'],
  defaultSortBy: [['login', 'ASC']],
  nullSort: 'last',
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findPaginated(query: PaginateQuery) {
    return await paginate(
      query,
      this.usersRepository,
      USER_ENTITY_PAGINATION_CONFIG,
    );
  }

  async save(userEntity: UserEntity): Promise<UserEntity> {
    const query = this.dataSource
      .createQueryBuilder()
      .useTransaction(true)
      .insert()
      .into(UserEntity)
      .values(userEntity);
    const {
      identifiers: [{ id }],
    } = await query.execute();
    if (typeof id !== 'string') {
      throw new InternalServerErrorException();
    }
    userEntity.id = id;
    return userEntity;
  }

  async findOne(
    login: string,
    selectFields?: FindOptionsSelect<UserEntity>,
  ): Promise<UserEntity | null> {
    const query = this.dataSource
      .createQueryBuilder(UserEntity, 'user')
      .useTransaction(true)
      .setFindOptions({
        where: { login },
        select: selectFields,
      });
    const result = await query.getOne();
    return result;
  }

  async softDeleteUser(login: string) {
    const query = this.dataSource
      .createQueryBuilder()
      .useTransaction(true)
      .softDelete()
      .from(UserEntity, 'user')
      .where('login = :login', { login });
    const updateResults = await query.execute();
    return updateResults;
  }

  async update(
    login: string,
    updateDeleted: boolean,
    partial: Partial<UserEntity>,
  ) {
    let queryBuilder = this.dataSource
      .createQueryBuilder()
      .useTransaction(true)
      .update(UserEntity, partial)
      .where('login = :login', { login });
    if (!updateDeleted) {
      queryBuilder = queryBuilder.andWhere('deletedAt IS NULL');
    }
    const updateResults = await queryBuilder.execute();
    return updateResults;
  }
}
