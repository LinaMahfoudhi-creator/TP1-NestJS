// src/commands/skill.seeder.ts
import { INestApplicationContext } from '@nestjs/common';
import { randSkill} from '@ngneat/falso';
import { SkillService } from '../skill/skill.service';


export async function seedSkills(app: INestApplicationContext, count = 10) {
  const skillService = app.get(SkillService);
  const designations = Array.from(new Set(randSkill({ length: count })));
  for (const designation of designations) {
    await skillService.create({ designation });
  }
}