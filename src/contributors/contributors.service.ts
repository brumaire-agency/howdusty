import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contributor } from './entity/contributor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private contributorsRepository: Repository<Contributor>,
  ) {}

  findAll(): Promise<Contributor[]> {
    return this.contributorsRepository.find();
  }
}
