import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../../prisma/services/prisma.service';
import { NotFoundException } from '../errors/not-found.error'; // Corrected import

describe('InvoiceService', () => {
  let service: InvoiceService;
  let prisma: PrismaService;

  const mockPrismaService = {
    invoice: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      aggregate: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllInvoices', () => {
    it('should return all invoices for a given user', async () => {
      const mockInvoices = [{ id: 1, user_id: 1, amount: 100 }];
      const mockTotal = 1;
      const page = 1;
      const limit = 10;

      mockPrismaService.invoice.findMany.mockResolvedValue(mockInvoices);
      mockPrismaService.invoice.count.mockResolvedValue(mockTotal);

      const result = await service.getAllInvoices(1, page, limit);
      expect(result).toEqual({
        invoices: mockInvoices,
        total: mockTotal,
        page,
        limit,
        pages: Math.ceil(mockTotal / limit),
      });
      expect(prisma.invoice.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        skip: 0,
        take: limit,
      });
      expect(prisma.invoice.count).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
    });
  });

  describe('getInvoiceById', () => {
    it('should return an invoice when it exists', async () => {
      const mockInvoice = { id: 1, user_id: 1, amount: 100 };
      mockPrismaService.invoice.findFirst.mockResolvedValue(mockInvoice);

      const result = await service.getInvoiceById(1, 1);
      expect(result).toEqual(mockInvoice);
      expect(prisma.invoice.findFirst).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 },
      });
    });

    it('should throw NotFoundException if invoice does not exist', async () => {
      mockPrismaService.invoice.findFirst.mockResolvedValue(null);

      await expect(service.getInvoiceById(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.invoice.findFirst).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 },
      });
    });
  });

  describe('getTotalAmountByDueDate', () => {
    it('should return the total amount due for the user', async () => {
      const mockTotal = { _sum: { amount: 300 } };
      mockPrismaService.invoice.aggregate.mockResolvedValue(mockTotal);

      const result = await service.getTotalAmountByDueDate(1);
      expect(result).toEqual(mockTotal);
      expect(prisma.invoice.aggregate).toHaveBeenCalledWith({
        _sum: { amount: true },
        where: { user_id: 1, due_date: { lte: new Date() }, paid: false },
      });
    });
  });
});
