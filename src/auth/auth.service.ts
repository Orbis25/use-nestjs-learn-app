import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { AuthCreadentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCreadentialsDto: AuthCreadentialsDto): Promise<void> {
    return await this.userRepository.signUp(authCreadentialsDto);
  }

  async signIn(authCreadentialsDto: AuthCreadentialsDto): Promise<string> {
    const username = await this.userRepository.validateUserPassword(
      authCreadentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('login failed');
    }

    const payload = { username };
    return this.jwtService.sign(payload);
  }
}
