import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter<TypeORMError> {
  catch(exception: TypeORMError) {
    if (exception instanceof EntityNotFoundError) {
      throw new NotFoundException();
    }
    if (exception instanceof QueryFailedError) {
      if (exception.driverError instanceof DatabaseError) {
        const pgError = exception.driverError;
        // https://www.postgresql.org/docs/current/errcodes-appendix.html
        const pgDriverCode: unknown = pgError.code;
        switch (pgDriverCode) {
          case '23505': // unique_violation
            throw new ConflictException('Duplicate entity');
          case '23503': // foreign_key_violation
            throw new BadRequestException('Related entity is missing');
          case '23502': // not_null_violation
            throw new BadRequestException('A required field is missing');
          case '40001': // transaction serialization_failure
          case '40P01': // deadlock_detected
            throw new ServiceUnavailableException(
              'Temporary database conflict. Please, retry',
            );
        }
      }
      throw new InternalServerErrorException('Database query failed');
    }
    throw new InternalServerErrorException();
  }
}
