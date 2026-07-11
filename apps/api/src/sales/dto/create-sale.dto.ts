import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateSaleDto {
  @IsOptional() @IsUUID() leadId?: string;

  @IsUUID()
  customerId!: string;

  @IsUUID()
  vehicleId!: string;

  @IsOptional() @IsUUID() salespersonId?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  salePrice!: number;

  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) discount?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) commissionRate?: number;

  @IsOptional() @IsDateString() deliveryDate?: string;
  @IsOptional() @IsInt() @Type(() => Number) warrantyMonths?: number;
  @IsOptional() @IsString() warrantyNotes?: string;
}
