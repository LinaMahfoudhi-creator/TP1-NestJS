// src/cv/cv.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/crud.service';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService extends CrudService<Cv> {
  constructor(@InjectRepository(Cv) repo: Repository<Cv>) {
    super(repo);
  }

  findAll() {
  return this.repository.find({
    relations: { user: true, skills: true },
  }); //chaque Cv est renvoyé avec son user et son tableau de skills.
}

  async createCv(dto: CreateCvDto) {
    const { userId, skillIds, ...data } = dto; //on sépare userId et skillIds du reste
    const cv = this.repository.create({
      ...data,
      ...this.buildRelations(userId, skillIds), //transforme ces deux ids en relations TypeORM.
    });
    return this.repository.save(cv); //fait l’INSERT du Cv, et remplit la table de jointure cv_skills_skill pour les skills, avec la clé étrangère userId pour le user
  }

  async updateCv(id: number, dto: UpdateCvDto) {
    const { userId, skillIds, ...data } = dto;
    const cv = await this.repository.preload({ //charge le Cv existant et fusionne les nouvelles valeurs dessus
      id,
      ...data,
      ...this.buildRelations(userId, skillIds),
    });
    if (!cv) throw new NotFoundException(ERROR_MESSAGES.ELEMENT_NOT_FOUND(id));
    return this.repository.save(cv);
  }

  // Transforme les ids reçus en objets de relation TypeORM
  private buildRelations(userId?: number, skillIds?: number[]) {
    return {
      ...(userId && { user: { id: userId } }),
      ...(skillIds && { skills: skillIds.map((id) => ({ id })) }),

      //C’est le petit traducteur : le client envoie des ids (userId: 1, skillIds: [2, 3]), mais TypeORM attend des objets de relation (plus long et explicite)
    };
  }
}