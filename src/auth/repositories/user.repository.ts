import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCreadentialsDto } from '../dto/auth-credentials.dto';
import { BadRequestException } from '@nestjs/common';
import * as bycryp from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCreadentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const exist = await this.findOne({ username });
    if (exist) {
      throw new BadRequestException(`the user ${username} already use`);
    }
    const user = new User();
    user.username = username;
    user.passwordHash = await bycryp.genSaltSync();
    user.password = await this.hashPassword(password, user.passwordHash);
    try {
      await user.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bycryp.hashSync(password, salt);
  }
}
