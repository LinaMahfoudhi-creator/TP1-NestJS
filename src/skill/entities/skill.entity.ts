import { Column, Entity, ManyToMany} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Cv } from '../../cv/entities/cv.entity';

@Entity()
export class Skill extends BaseEntity {
  @Column() designation: string;

  @ManyToMany(() => Cv, (cv) => cv.skills) // relation many-to-many avec Cv
  cvs: Cv[];
}