import { Column, Entity, OneToMany} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Cv } from '../../cv/entities/cv.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true }) username: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Cv, (cv) => cv.user) //one user can have many cvs
  cvs: Cv[];
}

