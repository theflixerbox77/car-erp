import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDealerDto {
  @IsString()
  @MinLength(2)
  businessName!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'slug may only contain lowercase letters, numbers and hyphens' })
  slug!: string;

  @IsString()
  @MinLength(2)
  ownerFullName!: string;

  @IsEmail()
  ownerEmail!: string;

  @IsString()
  @MinLength(8)
  ownerPassword!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
