import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserInput,
  UpdateEmailInput,
  UpdatePasswordInput,
} from './dto/user.inputs';
// import { UpdatePasswordInput } from './dto/user.inputs';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async compareSecrets(hash: string, secret: string): Promise<boolean> {
    const valid = await argon.verify(hash, secret);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return true;
  }

  async createUser(data: CreateUserInput) {
    await this.checkIfUserAlreadyExist(data.email);
    const hash = await argon.hash(data.password);
    const user = await this.prisma.user.create({
      data: { email: data.email, password: hash },
      select: { id: true, email: true },
    });

    return user;
  }
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async checkIfUserAlreadyExist(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) throw new NotFoundException('User already exists');

    return user;
  }

  async updateUserPassword(id: string, data: UpdatePasswordInput) {
    const hash = await argon.hash(data.newPassword);
    await this.prisma.user.update({
      where: { id },
      data: { password: hash },
    });
  }

  async updatedUserEmail(id: string, data: UpdateEmailInput) {
    await this.prisma.user.update({
      where: { id },
      data: { email: data.email },
    });
  }

  async assignRolesToUser(id: string, roles: string[]) {
    await this.prisma.user.update({
      where: { id },
      data: {
        roles: {
          createMany: {
            data: roles.map((role_id) => ({
              role_id,
            })),
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async removeRolesFromUser(id: string, roles: string[]) {
    await this.prisma.user.update({
      where: { id },
      data: {
        roles: {
          deleteMany: {
            role_id: {
              in: roles,
            },
          },
        },
      },
    });
  }

  async getUserPermissions(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User Not Found');

    const permissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.name),
    );

    return permissions;
  }

  async getUserRoles(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return user?.roles ?? [];
  }
}
