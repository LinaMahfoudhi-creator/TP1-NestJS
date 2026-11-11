import { Column, Entity, ManyToMany, ManyToOne, JoinTable} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';

@Entity()
export class Cv extends BaseEntity {
  @Column() name: string;
  @Column() firstname: string;
  @Column() age: number;
  @Column({ unique: true }) cin: number;
  @Column() job: string;
  @Column({ nullable: true }) path: string;

  @ManyToOne(() => User, (user) => user.cvs)
  user: User; // plusieurs CVs peuvent appartenir à un seul utilisateur

  @ManyToMany(() => Skill, (skill) => skill.cvs)
  @JoinTable()   // uniquement du côté propriétaire (Cv), maître
  skills: Skill[];
}