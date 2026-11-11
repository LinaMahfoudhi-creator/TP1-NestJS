import { Module } from '@nestjs/common';
import { MiddlewareConsumer} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoV2Controller } from './todo-v2.controller';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodoController, TodoV2Controller],
  providers: [TodoService],
})
export class TodoModule{ //appliquer le middleware AuthMiddleware à toutes les routes du TodoController
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TodoController);
  }
}