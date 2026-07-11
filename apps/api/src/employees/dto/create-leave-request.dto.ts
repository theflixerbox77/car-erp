import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsOptional() @IsString() type?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional() @IsString() reason?: string;
}
