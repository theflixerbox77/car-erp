import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

const TEAM_MEMBER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  role: { select: { id: true, name: true } },
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    // Uses the raw client: at this point we only know the user id, not yet a
    // confirmed tenant-scoped context for this lookup (it IS the lookup that
    // tells us the tenant), so this one query intentionally bypasses scoping.
    const user = await this.prisma.raw.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        isPlatformAdmin: true,
        tenantId: true,
        role: { select: { id: true, name: true } },
        tenant: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            subscriptionStatus: true,
            subscriptionPlan: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.raw.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.raw.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const matches = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!matches)
      throw new BadRequestException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.raw.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return { success: true };
  }

  listTeam() {
    return this.prisma.client.user.findMany({
      where: { isPlatformAdmin: false },
      orderBy: { createdAt: 'asc' },
      select: TEAM_MEMBER_SELECT,
    });
  }

  listRoles() {
    return this.prisma.client.role.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  }

  async createTeamMember(tenantId: string, dto: CreateTeamMemberDto) {
    const existing = await this.prisma.raw.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing)
      throw new ConflictException('An account with that email already exists');

    const role = await this.prisma.client.role.findUnique({
      where: { id: dto.roleId },
    });
    if (!role) throw new BadRequestException('Invalid role');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.prisma.client.user.create({
      data: {
        tenantId,
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        roleId: dto.roleId,
        status: 'active',
      },
      select: TEAM_MEMBER_SELECT,
    });
  }

  async updateTeamMember(id: string, dto: UpdateTeamMemberDto) {
    const existing = await this.prisma.client.user.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Team member not found');

    if (dto.roleId) {
      const role = await this.prisma.client.role.findUnique({
        where: { id: dto.roleId },
      });
      if (!role) throw new BadRequestException('Invalid role');
    }

    return this.prisma.client.user.update({
      where: { id },
      data: { roleId: dto.roleId, status: dto.status },
      select: TEAM_MEMBER_SELECT,
    });
  }
}
