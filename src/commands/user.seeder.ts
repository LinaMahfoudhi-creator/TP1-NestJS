// src/commands/user.seeder.ts
import { INestApplicationContext } from '@nestjs/common';
import { randEmail, randPassword, randUserName } from '@ngneat/falso';
import { UserService } from '../user/user.service';

    
export async function seedUsers(
  app: INestApplicationContext,
  count = 5,
): Promise<void> {
  const userService = app.get(UserService);

  for (let i = 0; i < count; i++) {
    await userService.create({
      username: `${randUserName()}${i}`,
      email: `${i}${randEmail()}`,
      password: randPassword({ size: 10 }),
    });
  }
}