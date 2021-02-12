import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../task-status.enum';

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
}
