import { Body, Controller, Post } from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';

@Controller({
  path: 'todo',
  version: '2',
})
export class TodoV2Controller {
  constructor() {}

  
  @Post()
  addTodo(@Body() dto: AddTodoDto) {
    return dto;
  }
}