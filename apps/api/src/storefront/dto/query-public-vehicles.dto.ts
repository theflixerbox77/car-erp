import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryPublicVehiclesDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() transmission?: string;
  @IsOptional() @IsString() fuelType?: string;

  @IsOptional() @IsInt() @Type(() => Number) minPrice?: number;
  @IsOptional() @IsInt() @Type(() => Number) maxPrice?: number;
  @IsOptional() @IsInt() @Type(() => Number) minYear?: number;
  @IsOptional() @IsInt() @Type(() => Number) maxYear?: number;
  @IsOptional() @IsInt() @Type(() => Number) maxMileage?: number;

  @IsOptional() @IsInt() @Min(1) @Max(48) @Type(() => Number) limit?: number =
    24;
  @IsOptional() @IsInt() @Min(0) @Type(() => Number) offset?: number = 0;

  @IsOptional()
  @IsIn(['created_at', 'year', 'selling_price', 'mileage'])
  sortBy?: 'created_at' | 'year' | 'selling_price' | 'mileage' = 'created_at';
  @IsOptional() @IsIn(['asc', 'desc']) sortDir?: 'asc' | 'desc' = 'desc';
}
