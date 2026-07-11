import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsString()
  name!: string;

  @IsOptional() @IsBoolean() isRecurringDefault?: boolean;
}
