import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/crud.service';
import { Skill } from './entities/skill.entity';
@Injectable()
export class SkillService extends CrudService<Skill> {
  constructor(@InjectRepository(Skill) repo: Repository<Skill>) {
    super(repo);
  }
}
