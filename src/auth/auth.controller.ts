import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { AuthCreadentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCreadentialsDto,
  ): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCreadentialsDto,
  ): Promise<{ token: string }> {
    return { token: await this.authService.signIn(authCredentialsDto) };
  }

  @Get('/tes')
  @UseGuards(AuthGuard('jwt'))
  test(@GetUser() user:User): void {
    console.log(user);
  }
}
