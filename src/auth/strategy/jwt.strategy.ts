import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //define the token extraction
      secretOrKey: 'topSecret51',
      ignoreExpiration: false,
    });
  }

  async validate(payload: { username: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      username: payload.username,
    });

    if (!user) {
      throw new UnauthorizedException('not autorized user');
    }

    return user;
  }
}
