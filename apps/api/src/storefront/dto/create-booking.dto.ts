import { IsEmail, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

const TYPES = ['reservation', 'test_drive'] as const;

export class CreateBookingDto {
  @IsUUID()
  vehicleId!: string;

  @IsIn(TYPES)
  type!: (typeof TYPES)[number];

  @IsString()
  fullName!: string;

  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() note?: string;
}
