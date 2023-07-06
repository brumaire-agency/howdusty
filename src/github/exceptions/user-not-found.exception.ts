import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor(username: string) {
    super(
      `github failed to return a user matching the given username (${username})`,
      HttpStatus.NOT_FOUND,
    );
  }
}
