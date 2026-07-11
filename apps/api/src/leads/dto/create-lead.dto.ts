import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLeadDto {
  @IsUUID()
  customerId!: string;

  @IsOptional() @IsUUID() vehicleId?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsDateString() expectedCloseDate?: string;
  @IsOptional() @IsUUID() assignedTo?: string;
}
