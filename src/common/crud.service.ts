import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../common/constants/error-messages';


export class CrudService<T extends ObjectLiteral & { id: number }> {
  constructor(protected readonly repository: Repository<T>) {}

  create(dto: DeepPartial<T>) {
    return this.repository.save(this.repository.create(dto)); // Create and save the entity in one step
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async update(id: number, dto: DeepPartial<T>) {
    const entity = await this.repository.preload({ id, ...dto } as any);
    if (!entity) throw new NotFoundException(ERROR_MESSAGES.ELEMENT_NOT_FOUND(id));
    return this.repository.save(entity);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    return this.repository.remove(entity);
  }
}