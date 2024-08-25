import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { InvoiceController } from './controllers';
import { InvoiceService } from './services';

@Module({
  imports: [PrismaModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
