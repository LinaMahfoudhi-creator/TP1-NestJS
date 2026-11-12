import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/crud.service';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  // user.service.ts
findByUsername(username: string) {
  return this.repository.findOne({ where: { username } });
}

findByUsernameOrEmail(username: string, email: string) {
  return this.repository.findOne({ where: [{ username }, { email }] });
}
}
