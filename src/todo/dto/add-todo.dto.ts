import { IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ERROR_MESSAGES } from '../../common/constants/error-messages';
import { TodoStatusEnum } from '../enums/todo-status.enum';

export class AddTodoDto {
  @IsNotEmpty({ message: ERROR_MESSAGES.NAME_REQUIRED })
  @MinLength(3, { message: ERROR_MESSAGES.NAME_MIN_LENGTH })
  @MaxLength(10, { message: ERROR_MESSAGES.NAME_MAX_LENGTH })
  name: string;

  @IsNotEmpty({ message: ERROR_MESSAGES.DESCRIPTION_REQUIRED })
  @MinLength(10, { message: ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH })
  description: string;

  @IsOptional()
  @IsEnum(TodoStatusEnum, { message: ERROR_MESSAGES.STATUS_INVALID })
  status?: TodoStatusEnum;
}