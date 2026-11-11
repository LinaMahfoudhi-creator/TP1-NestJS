import { IsString, IsInt, IsOptional, IsArray } from "class-validator";

// create-cv.dto.ts
export class CreateCvDto {
  @IsString() name: string;
  @IsString() firstname: string;
  @IsInt() age: number;
  @IsInt() cin: number;
  @IsString() job: string;
  @IsOptional() @IsString() path?: string;
  @IsOptional() @IsInt() userId?: number;
  @IsOptional() @IsArray() skillIds?: number[];
}