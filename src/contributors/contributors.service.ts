import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contributor } from './entity/contributor.entity';
import { Repository } from 'typeorm';
import { ContributorDto } from './dto';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private contributorsRepository: Repository<Contributor>,
  ) {}

  findAll(): Promise<Contributor[]> {
    return this.contributorsRepository.find();
  }

  create(contributorDto: ContributorDto): Promise<Contributor> {
    const contributor = new Contributor();
    contributor.username = contributorDto.username;
    contributor.name = contributorDto.name;
    contributor.avatarUrl = contributorDto.avatarUrl;

    return this.contributorsRepository.save(contributor);
  }

  update(id: number, contributorDto: ContributorDto): Promise<Contributor> {
    return this.contributorsRepository.save({ ...contributorDto, id });
  }
}
