import { NotFoundException } from '@nestjs/common';

export class UserNotFound extends NotFoundException {
  constructor(username: string) {
    super(
      `github failed to return a user matching the given username (${username})`,
    );
  }
}
