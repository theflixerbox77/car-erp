import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: RequestUser) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: RequestUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('me/password')
  changePassword(
    @CurrentUser() user: RequestUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, dto);
  }

  @Get('team')
  @UseGuards(TenantScopedGuard)
  @Permissions('team.manage')
  listTeam() {
    return this.usersService.listTeam();
  }

  @Get('roles')
  @UseGuards(TenantScopedGuard)
  @Permissions('team.manage')
  listRoles() {
    return this.usersService.listRoles();
  }

  @Post('team')
  @UseGuards(TenantScopedGuard)
  @Permissions('team.manage')
  createTeamMember(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateTeamMemberDto,
  ) {
    return this.usersService.createTeamMember(user.tenantId as string, dto);
  }

  @Patch('team/:id')
  @UseGuards(TenantScopedGuard)
  @Permissions('team.manage')
  updateTeamMember(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.usersService.updateTeamMember(id, dto);
  }
}
