import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { NotFoundException } from '../errors/not-found.error';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async getAllInvoices(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: {
          user_id: userId,
        },
        skip: skip,
        take: limit,
      }),
      this.prisma.invoice.count({
        where: {
          user_id: userId,
        },
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      invoices,
      total,
      page,
      limit,
      pages,
    };
  }

  async getInvoiceById(id: number, userId: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, user_id: userId },
    });
    if (!invoice) {
      throw new NotFoundException(id);
    }
    return invoice;
  }

  async getTotalAmountByDueDate(userId: number, dueDate: Date = new Date()) {
    return this.prisma.invoice.aggregate({
      _sum: { amount: true },
      where: {
        user_id: userId,
        due_date: {
          lte: dueDate,
        },
        paid: false,
      },
    });
  }
}
