import { IsIn } from 'class-validator';

const INQUIRY_STATUSES = ['new', 'contacted', 'converted', 'closed'] as const;

export class UpdateInquiryStatusDto {
  @IsIn(INQUIRY_STATUSES)
  status!: (typeof INQUIRY_STATUSES)[number];
}
