import { IsEmail, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

const SOURCES = ['whatsapp_click', 'contact_form', 'reserve_button'] as const;

export class CreateInquiryDto {
  @IsOptional() @IsUUID() vehicleId?: string;

  @IsString()
  customerName!: string;

  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() message?: string;
  @IsOptional() @IsIn(SOURCES) source?: (typeof SOURCES)[number];
}
