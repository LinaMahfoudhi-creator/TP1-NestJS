// src/commands/cv.seeder.ts
import { INestApplicationContext } from '@nestjs/common';
import {
  randFilePath,
  randFirstName,
  randJobTitle,
  randLastName,
  randNumber,
} from '@ngneat/falso';
import { CvService } from '../cv/cv.service';
import { UserService } from '../user/user.service';
import { SkillService } from '../skill/skill.service';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';

function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]; //renvoie un élément aléatoire du tableau
}

function pickSome<T>(items: T[], count: number): T[] {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count); //renvoie un sous-ensemble aléatoire du tableau, de taille count
}

export async function seedCvs(app: INestApplicationContext, count = 20) {
  const cvService = app.get(CvService); //on récupère le service CvService depuis le contexte de l'application NestJS
  const users: User[] = await app.get(UserService).findAll();
  const skills: Skill[] = await app.get(SkillService).findAll();

  if (!users.length || !skills.length) {
    throw new Error('Seedez les users et les skills avant les cvs');
  }

  for (let i = 0; i < count; i++) {
    await cvService.createCv({
      name: randLastName(),
      firstname: randFirstName(),
      age: randNumber({ min: 18, max: 60 }),
      cin: randNumber({ min: 10000000, max: 99999999 }),
      job: randJobTitle(),
      path: randFilePath(),
      userId: pickOne(users).id, //on choisit un user aléatoire parmi ceux existants
      skillIds: pickSome(skills, randNumber({ min: 1, max: 4 })).map((s) => s.id), //on choisit un sous-ensemble aléatoire de skills parmi ceux existants, de taille aléatoire entre 1 et 4, et on ne garde que leurs ids
    });
  }
}