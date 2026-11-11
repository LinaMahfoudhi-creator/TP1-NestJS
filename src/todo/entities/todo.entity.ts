import { Column, Entity} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { TodoStatusEnum } from '../enums/todo-status.enum';

@Entity('todo')
export class TodoEntity extends BaseEntity {

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TodoStatusEnum,
    default: TodoStatusEnum.waiting,
  })
  status: TodoStatusEnum;

  // Ajout de la colonne userId pour stocker l'ID de l'utilisateur qui a créé le todo
  @Column()
  userId: number;
}