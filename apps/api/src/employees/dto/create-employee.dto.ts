import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

const SALARY_TYPES = ['fixed', 'commission', 'hybrid'] as const;

export class CreateEmployeeDto {
  @IsString()
  fullName!: string;

  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsUUID() roleId?: string;
  @IsOptional() @IsDateString() hireDate?: string;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) salaryAmount?: number;
  @IsOptional() @IsIn(SALARY_TYPES) salaryType?: (typeof SALARY_TYPES)[number];
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) commissionRate?: number;
}
