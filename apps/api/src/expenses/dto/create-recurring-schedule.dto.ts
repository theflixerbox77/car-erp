import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

const FREQUENCIES = ['weekly', 'monthly', 'yearly'] as const;

export class CreateRecurringScheduleDto {
  @IsUUID()
  categoryId!: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount!: number;

  @IsOptional() @IsString() description?: string;

  @IsIn(FREQUENCIES)
  frequency!: (typeof FREQUENCIES)[number];

  @IsDateString()
  nextRunDate!: string;
}
