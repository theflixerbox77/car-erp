import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBusinessSettingsDto {
  @IsOptional() @IsString() legalName?: string;
  @IsOptional() @IsUrl() logoUrl?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsappNumber?: string;
  @IsOptional() @IsString() customDomain?: string;
  @IsOptional() @IsString() about?: string;
  @IsOptional() @IsUrl() heroImageUrl?: string;
}
