import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../auth/guards';
import { InvoiceService } from '../services';
import {
  GetAllInvoicesDto,
  GetInvoiceByIdParamsDto,
  GetTotalAmountByDueDateDto,
} from '../dtos';
import { AuthenticatedRequest } from '../../auth/interfaces/AuthentificatedRequest';

@Controller('invoices')
@UseGuards(JwtGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async getAllInvoices(
    @Request() { user }: AuthenticatedRequest,
    @Query() { page = 1, limit = 10 }: GetAllInvoicesDto,
  ) {
    return await this.invoiceService.getAllInvoices(user.id, page, limit);
  }

  @Get(':id')
  async getInvoiceById(
    @Request() { user }: AuthenticatedRequest,
    @Param() { id }: GetInvoiceByIdParamsDto,
  ) {
    return this.invoiceService.getInvoiceById(id, user.id);
  }

  @Get('total')
  async getTotalAmountByDueDate(
    @Request() { user }: AuthenticatedRequest,
    @Query() { dueDate }: GetTotalAmountByDueDateDto,
  ) {
    return this.invoiceService.getTotalAmountByDueDate(user.id, dueDate);
  }
}
