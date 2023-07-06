export class UserNotFoundException extends Error {
  constructor(username: string) {
    super(
      `github failed to return a user matching the given username (${username})`,
    );
  }
}
