// src/skill/dto/create-skill.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  designation: string;
}