import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

const STATUSES = ['available', 'reserved', 'sold', 'in_transit', 'repairing', 'booked', 'hidden'] as const;

export class CreateVehicleDto {
  @IsString()
  stockNumber!: string;

  @IsOptional() @IsString() vin?: string;
  @IsOptional() @IsString() chassisNumber?: string;
  @IsOptional() @IsString() engineNumber?: string;

  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsOptional() @IsString() trim?: string;

  @IsInt()
  @Type(() => Number)
  year!: number;

  @IsOptional() @IsString() auctionGrade?: string;
  @IsOptional() @IsString() registrationNumber?: string;
  @IsOptional() @IsDateString() registrationExpiry?: string;
  @IsOptional() @IsString() fuelType?: string;
  @IsOptional() @IsString() transmission?: string;
  @IsOptional() @IsString() driveType?: string;

  @IsOptional() @IsInt() @Type(() => Number) mileage?: number;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() condition?: string;
  @IsOptional() @IsString() bodyType?: string;

  @IsOptional() @IsArray() features?: string[];

  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) importCost?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) auctionCost?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) shippingCost?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) customsCost?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) repairCost?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) registrationCost?: number;

  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) sellingPrice?: number;
  @IsOptional() @IsNumber() @Type(() => Number) expectedProfit?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minimumPrice?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) discountAmount?: number;

  @IsOptional() @IsIn(STATUSES) status?: (typeof STATUSES)[number];
  @IsOptional() @IsBoolean() isFeatured?: boolean;
}
