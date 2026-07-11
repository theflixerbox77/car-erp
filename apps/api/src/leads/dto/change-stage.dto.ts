import { IsIn, IsOptional, IsString } from 'class-validator';

export const LEAD_STAGES = ['new', 'contacted', 'negotiation', 'booked', 'payment_pending', 'delivered', 'completed', 'lost'] as const;

export class ChangeStageDto {
  @IsIn(LEAD_STAGES)
  stage!: (typeof LEAD_STAGES)[number];

  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsString() lostReason?: string;
}
