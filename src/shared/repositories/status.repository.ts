import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../common/base.repository';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusRepository extends BaseRepository<Status> {
  constructor(@InjectRepository(Status) repo: Repository<Status>) {
    super(repo);
  }
}
