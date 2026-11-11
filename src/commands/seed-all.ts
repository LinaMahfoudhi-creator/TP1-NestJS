import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedUsers } from './user.seeder';
import { seedSkills } from './skill.seeder';
import { seedCvs } from './cv.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  await seedUsers(app);
  await seedSkills(app);
  await seedCvs(app);

  await app.close();
}

bootstrap();