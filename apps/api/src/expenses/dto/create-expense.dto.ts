import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsUUID()
  categoryId!: string;

  @IsOptional() @IsUUID() vehicleId?: string;

  @IsNumber() @Min(0.01) @Type(() => Number)
  amount!: number;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() expenseDate?: string;
  @IsOptional() @IsBoolean() isRecurring?: boolean;
}
