import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryVehiclesDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() status?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 25;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsIn(['created_at', 'year', 'selling_price', 'mileage'])
  sortBy?: 'created_at' | 'year' | 'selling_price' | 'mileage' = 'created_at';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc' = 'desc';
}
