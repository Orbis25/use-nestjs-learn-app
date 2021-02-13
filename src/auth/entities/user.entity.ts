import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bycryp from 'bcrypt';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  passwordHash: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bycryp.hash(password, this.passwordHash);
    return hash === this.password;
  }
}
