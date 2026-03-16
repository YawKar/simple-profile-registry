import {
  All,
  Controller,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

class MyCustomException extends HttpException {
  constructor(message: string) {
    super({ message }, HttpStatus.CONFLICT);
  }
}

@Controller('exceptions')
export class ExceptionsController {
  @All('predefined')
  predefined() {
    throw new ForbiddenException();
  }

  @All('predefined-with-message')
  predefinedWithMessage() {
    throw new ForbiddenException('custom message');
  }

  @All('predefined-with-object')
  predefinedWithObject() {
    throw new ForbiddenException({
      field1: 'custom field1',
      field2: 'custom field2',
    });
  }

  @All('plain-http-exception-forbidden')
  plainHttpExceptionForbidden() {
    throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
  }

  @All('plain-http-exception-with-custom-object')
  plainHttpExceptionWithCustomObject() {
    throw new HttpException(
      {
        field1: 'custom field1',
        field2: 'custom field2',
      },
      HttpStatus.CONFLICT,
    );
  }

  @All('my-custom-exception')
  myCustomException() {
    throw new MyCustomException('This is the custom message');
  }
}
