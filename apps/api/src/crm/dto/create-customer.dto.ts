import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  fullName!: string;

  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() nidNumber?: string;
  @IsOptional() @IsString() licenseNumber?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() source?: string;
}
