import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { PrismaService } from '../prisma/prisma.service';
import { STORAGE_PROVIDER } from '../storage/storage-provider.interface';
import type { StorageProvider } from '../storage/storage-provider.interface';
import { InvoiceDocument, InvoiceData } from './templates/invoice.template';

const DOCUMENT_TITLES: Record<string, string> = {
  invoice: 'Invoice',
  money_receipt: 'Money Receipt',
  quotation: 'Quotation',
  delivery_note: 'Delivery Note',
  sales_agreement: 'Sales Agreement',
};

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
  ) {}

  async generate(tenantId: string, saleId: string, userId: string, type: string) {
    const sale = await this.prisma.client.sale.findUnique({
      where: { id: saleId },
      include: { customer: true, vehicle: true, payments: true, tenant: true },
    });
    if (!sale) throw new NotFoundException('Sale not found');

    const amountPaid = sale.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const netTotal = Number(sale.salePrice) - Number(sale.discount);

    const data: InvoiceData = {
      documentTitle: DOCUMENT_TITLES[type] ?? 'Document',
      invoiceNumber: `${sale.tenant.slug.toUpperCase()}-${sale.id.slice(0, 8).toUpperCase()}`,
      issuedAt: new Date().toLocaleDateString(),
      dealer: { businessName: sale.tenant.businessName, address: sale.tenant.address, phone: sale.tenant.phone, email: null },
      customer: { fullName: sale.customer.fullName, phone: sale.customer.phone, email: sale.customer.email, address: sale.customer.address },
      vehicle: { brand: sale.vehicle.brand, model: sale.vehicle.model, year: sale.vehicle.year, stockNumber: sale.vehicle.stockNumber, vin: sale.vehicle.vin },
      salePrice: sale.salePrice.toString(),
      discount: sale.discount.toString(),
      amountPaid: amountPaid.toString(),
      amountDue: (netTotal - amountPaid).toString(),
    };

    // react-pdf's renderToBuffer types expect a <Document> element specifically; our
    // template is a component that renders one, which is structurally fine at runtime.
    const buffer = await renderToBuffer(React.createElement(InvoiceDocument, { data }) as Parameters<typeof renderToBuffer>[0]);

    const path = `${tenantId}/${saleId}/${type}-${randomUUID()}.pdf`;
    await this.storage.upload('private', path, Buffer.from(buffer), 'application/pdf');

    return this.prisma.client.saleDocument.create({
      data: { saleId, tenantId, type, storagePath: path, generatedBy: userId },
    });
  }

  async list(saleId: string) {
    return this.prisma.client.saleDocument.findMany({ where: { saleId }, orderBy: { generatedAt: 'desc' } });
  }

  async getSignedUrl(saleId: string, documentId: string) {
    const doc = await this.prisma.client.saleDocument.findUnique({ where: { id: documentId } });
    if (!doc || doc.saleId !== saleId) throw new NotFoundException('Document not found');
    return this.storage.getSignedUrl(doc.storagePath);
  }
}
