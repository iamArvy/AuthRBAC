import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async createRole(data: Prisma.RoleCreateInput) {
    const role = await this.prisma.role.findUnique({
      where: { name: data.name },
    });
    if (role) throw new BadRequestException('Role already exists');
    return this.prisma.role.create({ data });
  }

  async findAllRoles() {
    return this.prisma.role.findMany();
  }

  async findRole(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findRoleByName(name: string) {
    const role = await this.prisma.role.findUnique({
      where: { name },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async assignPermissionsToRole(id: string, permissions: string[]) {
    await this.prisma.role.update({
      where: { id },
      data: {
        permissions: {
          createMany: {
            data: permissions.map((permission_id) => ({
              permission_id,
            })),
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async removePermissionsFromRole(id: string, permissions: string[]) {
    await this.prisma.role.update({
      where: { id },
      data: {
        permissions: {
          deleteMany: {
            permission_id: {
              in: permissions,
            },
          },
        },
      },
    });
  }

  async getRolePermissions(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) throw new NotFoundException('Role not found');
    return role.permissions;
  }

  async updateRole(id: string, data: Prisma.RoleUpdateInput) {
    await this.prisma.role.update({
      where: { id },
      data,
    });
    return true;
  }

  async deleteRole(id: string) {
    await this.prisma.role.delete({
      where: { id },
    });
  }
}
