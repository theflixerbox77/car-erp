import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { DocumentsService } from '../documents/documents.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller('sales')
@UseGuards(TenantScopedGuard)
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Get()
  @Permissions('sales.view')
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Permissions('sales.view')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Post()
  @Permissions('sales.create')
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateSaleDto) {
    return this.salesService.create(user.tenantId as string, user.id, dto);
  }

  @Post(':id/payments')
  @Permissions('sales.update')
  recordPayment(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: RecordPaymentDto) {
    return this.salesService.recordPayment(user.tenantId as string, id, user.id, dto);
  }

  @Post(':id/documents/:type')
  @Permissions('sales.update')
  generateDocument(@CurrentUser() user: RequestUser, @Param('id') id: string, @Param('type') type: string) {
    return this.documentsService.generate(user.tenantId as string, id, user.id, type);
  }

  @Get(':id/documents/:documentId/signed-url')
  @Permissions('sales.view')
  getDocumentUrl(@Param('id') id: string, @Param('documentId') documentId: string) {
    return this.documentsService.getSignedUrl(id, documentId).then((url) => ({ url }));
  }
}
