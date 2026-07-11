import { IsIn, IsOptional, IsUUID } from 'class-validator';

const STATUSES = ['active', 'suspended'] as const;

export class UpdateTeamMemberDto {
  @IsOptional() @IsUUID() roleId?: string;
  @IsOptional() @IsIn(STATUSES) status?: (typeof STATUSES)[number];
}
