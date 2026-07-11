import { IsIn, IsOptional, IsString } from 'class-validator';

const STATUSES = ['available', 'reserved', 'sold', 'in_transit', 'repairing', 'booked', 'hidden'] as const;

export class ChangeStatusDto {
  @IsIn(STATUSES)
  status!: (typeof STATUSES)[number];

  @IsOptional()
  @IsString()
  note?: string;
}
