import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './dto/auth.inputs';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(data: RegisterInput) {
    const user = await this.userService.createUser(data);
    return this.authService.authenticateUser(user.id, user.email);
  }

  @Post('login')
  async login(data: LoginInput) {
    const user = await this.userService.findUserByEmail(data.email);
    await this.authService.compareSecrets(user.password, data.password);
    return this.authService.authenticateUser(user.id, user.email);
  }
}
