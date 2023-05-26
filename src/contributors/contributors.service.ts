import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContributorEntity } from './entity/contributor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(ContributorEntity)
    private contributorsRepository: Repository<ContributorEntity>,
  ) {}

  findAll(): Promise<ContributorEntity[]> {
    return this.contributorsRepository.find();
  }
}
