import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { gql, GraphQLClient } from 'graphql-request';
import { User } from './types';
import { UserNotFoundException } from './exceptions';
import { GithubQuery } from './queries/github.query';

@Injectable()
export class GithubApi {
  constructor(private readonly config: ConfigService) {}

  /**
   * Gets info from github.
   */
  async getInfo(username: string, queries: GithubQuery[]): Promise<User> {
    const ACCESS_TOKEN = this.config.get('github.access_token');

    const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    const query = queries.reduce(
      (accumulator, currentValue) =>
        `${accumulator} ${currentValue.buildQuery(username)}`,
      '',
    );

    try {
      const result = await graphQLClient.request(
        gql`
        query {
          ${query}
        }
      `,
      );
      const data = queries.reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          ...currentValue.parseResult(result),
        }),
        {},
      );
      return data as User;
    } catch (error) {
      if (error.response.errors) {
        error.response.errors.forEach((error) => {
          if (error.type === 'NOT_FOUND') {
            throw new UserNotFoundException(username);
          } else {
            throw error;
          }
        });
      } else {
        throw error;
      }
    }
  }
}
