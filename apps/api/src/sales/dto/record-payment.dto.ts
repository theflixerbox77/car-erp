import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

const METHODS = ['cash', 'bank_transfer', 'cheque', 'other'] as const;

export class RecordPaymentDto {
  @IsNumber() @Min(0.01) @Type(() => Number)
  amount!: number;

  @IsIn(METHODS)
  method!: (typeof METHODS)[number];

  @IsOptional() @IsString() referenceNote?: string;
}
