import { IsIn, IsOptional, IsString } from 'class-validator';

const TYPES = ['call', 'visit', 'whatsapp', 'email', 'note'] as const;

export class CreateInteractionDto {
  @IsIn(TYPES)
  type!: (typeof TYPES)[number];

  @IsString()
  summary!: string;

  @IsOptional() @IsString() occurredAt?: string;
}
