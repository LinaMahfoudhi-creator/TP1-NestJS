// src/cv/cv.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/crud.service';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import type { JwtUser } from '../auth/interfaces/request-with-user.interface';
import { ROLES_WITH_FULL_ACCESS } from '../common/constants/roles';


@Injectable()
export class CvService extends CrudService<Cv> {
  constructor(@InjectRepository(Cv) repo: Repository<Cv>) {
    super(repo);
  }

  createCv(dto: CreateCvDto, ownerId: number) {
    const { skillIds, ...data } = dto;
    const cv = this.repository.create({
      ...data,
      user: { id: ownerId },
      skills: skillIds?.map((id) => ({ id })),
    });
    return this.repository.save(cv);
  }

  findAllFor(user: JwtUser) {
  const canSeeAll = ROLES_WITH_FULL_ACCESS.includes(user.role);
  return this.repository.find({
    where: canSeeAll ? {} : { user: { id: user.userId } }, //filtre vide si c'est un admin (ou autre rôle avec accès complet), sinon filtre par userId
    relations: { user: true, skills: true }, // pour inclure les relations user et skills dans le résultat
  });
}

  // 404 si le cv n'existe pas, 403 s'il appartient à un autre
  async findOneOwned(id: number, ownerId: number) {
    const cv = await this.repository.findOne({
      where: { id },
      relations: { user: true, skills: true },
    });
    if (!cv) throw new NotFoundException(ERROR_MESSAGES.ELEMENT_NOT_FOUND(id));
    if (cv.user?.id !== ownerId) {
      throw new ForbiddenException('Ce cv ne vous appartient pas');
    }
    return cv;
  }

  async updateCv(id: number, dto: UpdateCvDto, ownerId: number) {
    await this.findOneOwned(id, ownerId);
    const { skillIds, ...data } = dto;
    const cv = await this.repository.preload({
      id,
      ...data,
      skills: skillIds?.map((id) => ({ id })),
    });
    return this.repository.save(cv!);
  }

  async removeOwned(id: number, ownerId: number) {
    const cv = await this.findOneOwned(id, ownerId);
    return this.repository.softRemove(cv);
  }
}