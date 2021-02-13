import { Type } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from '../task-status.enum';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  title: string;
  @Column({ type: 'varchar' })
  description: string;
  @Column({ type: 'varchar' })
  status: TaskStatus;
  @Column({ type: 'uuid', nullable: false })
  userId: string;
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
