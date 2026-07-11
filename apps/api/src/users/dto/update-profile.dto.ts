import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() @MinLength(2) fullName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsUrl() avatarUrl?: string;
}
