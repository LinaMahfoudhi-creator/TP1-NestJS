import { PartialType } from '@nestjs/mapped-types';
import { AddTodoDto } from './add-todo.dto';

export class UpdateTodoDto extends PartialType(AddTodoDto) {}