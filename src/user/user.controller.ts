import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateEmailInput, UpdatePasswordInput } from './dto/user.inputs';
import { RestAuthGuard } from '../guards';

@UseGuards(RestAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update-password')
  async updatePassword(
    @Req() req: { user: { id: string } },
    @Body('data') data: UpdatePasswordInput,
  ) {
    const user = await this.userService.findUserById(req.user.id);
    await this.userService.compareSecrets(user.password, data.oldPassword);
    await this.userService.updateUserPassword(req.user.id, data);
    return true;
  }

  @Post('update-email')
  async updateEmail(
    @Req() req: { user: { id: string } },
    @Body('data') data: UpdateEmailInput,
  ) {
    await this.userService.updatedUserEmail(req.user.id, data);
    return true;
  }
}
