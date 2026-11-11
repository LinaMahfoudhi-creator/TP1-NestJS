import { Body, Controller, Post, Patch, Param, ParseIntPipe, Get, Delete, Query, Req } from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoStatusEnum } from './enums/todo-status.enum';
import type { AuthRequest } from '../common/middlewares/auth.middleware';
@Controller({
  path: 'todo',
  version: '1',
})
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
addTodoDB(
  @Body() dto: AddTodoDto,
  @Req() req: AuthRequest,
) {
  return this.todoService.addTodo(dto, req.userId!);
}

@Patch(':id')
updateTodo(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateTodoDto,
  @Req() req: AuthRequest,
) {
  return this.todoService.updateTodo(id, dto, req.userId!);
}

@Delete(':id')
softDeleteTodo(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: AuthRequest,
) {
  return this.todoService.softDeleteTodo(id, req.userId!);
}

@Delete(':id/hard')
hardDeleteTodo(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: AuthRequest,
) {
  return this.todoService.hardDeleteTodo(id, req.userId!);
}

@Patch('restore/:id')
restoreTodo(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: AuthRequest,
) {
  return this.todoService.restoreTodo(id, req.userId!);
}

  @Get('count-by-status')
  countByStatus() {
  return this.todoService.countByStatus();
}

  @Get()
  findAll(
  @Query('search') search?: string,
  @Query('status') status?: TodoStatusEnum,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.todoService.findAll(
    search,
    status,
    Number(page),
    Number(limit),
  );
}

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
  return this.todoService.findOneById(id);
}
}