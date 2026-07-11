import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { DocumentsService } from '../documents/documents.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, DocumentsService],
})
export class SalesModule {}
