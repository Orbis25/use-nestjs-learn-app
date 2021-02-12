import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bycryp from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  passwordHash: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bycryp.hash(password, this.passwordHash);
    return hash === this.password;
  }
}
