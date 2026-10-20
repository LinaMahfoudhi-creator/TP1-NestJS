import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import { TodoStatusEnum } from './enums/todo-status.enum';


@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async addTodo(dto: AddTodoDto): Promise<TodoEntity> {
    const todo = this.todoRepository.create(dto);
    return await this.todoRepository.save(todo);
  }

  async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
  const todo = await this.todoRepository.preload({ id, ...dto });
  if (!todo) {
    throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND(id));
  }
  return await this.todoRepository.save(todo);
  }

  async hardDeleteTodo(id: number): Promise<void> {
  const todo = await this.todoRepository.findOne({
    where: { id },
    withDeleted: true,
  });

  if (!todo) {
    throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND(id));
  }

  await this.todoRepository.remove(todo);
}

  async softDeleteTodo(id: number): Promise<void> {
  const todo = await this.todoRepository.findOne({
    where: { id },
  });

  if (!todo) {
    throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND(id));
  }

  await this.todoRepository.softDelete(id);
}

  async restoreTodo(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id }, withDeleted: true });
    if (!todo) {
      throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND(id));
    }
    todo.deletedAt = null;
    return await this.todoRepository.save(todo);
  } 

  async countByStatus() {
  const result = await this.todoRepository
    .createQueryBuilder('todo')
    .select(
      `SUM(CASE WHEN todo.status = :active THEN 1 ELSE 0 END)`,
      'active',
    )
    .addSelect(
      `SUM(CASE WHEN todo.status = :waiting THEN 1 ELSE 0 END)`,
      'waiting',
    )
    .addSelect(
      `SUM(CASE WHEN todo.status = :done THEN 1 ELSE 0 END)`,
      'done',
    )
    .where('todo.deletedAt IS NULL')
    .setParameters({
      active: TodoStatusEnum.actif,
      waiting: TodoStatusEnum.waiting,
      done: TodoStatusEnum.done,
    })
    .getRawOne<{
      active: string | null;
      waiting: string | null;
      done: string | null;
    }>();

  return {
    actif: Number(result?.active ?? 0),
    waiting: Number(result?.waiting ?? 0),
    done: Number(result?.done ?? 0),
  };
  }
  
  async findAll(
  search?: string,
  status?: TodoStatusEnum,
  page = 1,
  limit = 10,
): Promise<TodoEntity[]> {
  const query = this.todoRepository.createQueryBuilder('todo');

  if (search) {
    query.andWhere(
      '(todo.name LIKE :search OR todo.description LIKE :search)',
      { search: `%${search}%` },
    );
  }

  if (status) {
    query.andWhere('todo.status = :status', { status });
  }

  query.skip((page - 1) * limit);
  query.take(limit);

  return query.getMany();
}


  async findOneById(id: number): Promise<TodoEntity> {
  const todo = await this.todoRepository.findOne({
    where: { id },
  });
  if (!todo) {
    throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND(id));
  }
  return todo;
}
  
}