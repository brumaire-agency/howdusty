import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributorDto } from './contributor.dto';
import { Contributor } from './contributor.entity';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private contributorsRepository: Repository<Contributor>,
  ) {}

  findAll(): Promise<Contributor[]> {
    return this.contributorsRepository.find();
  }

  findOne(username: string): Promise<Contributor> {
    return this.contributorsRepository.findOne({
      where: { username: username },
    });
  }

  async save(contributorDto) {
    return await this.contributorsRepository.save(contributorDto);
  }
}
