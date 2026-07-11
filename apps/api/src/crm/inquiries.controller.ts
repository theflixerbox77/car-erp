import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

/** Staff-facing view of leads captured through the public storefront (inquiry form). */
@Controller('inquiries')
@UseGuards(TenantScopedGuard)
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  @Permissions('crm.view')
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Patch(':id/status')
  @Permissions('crm.manage')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInquiryStatusDto) {
    return this.inquiriesService.updateStatus(id, dto);
  }
}
