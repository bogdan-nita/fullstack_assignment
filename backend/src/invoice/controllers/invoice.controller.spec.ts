import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from '../services';
import { JwtGuard } from '../../auth/guards';
import {
  GetAllInvoicesDto,
  GetInvoiceByIdParamsDto,
  GetTotalAmountByDueDateDto,
} from '../dtos';
import { AuthenticatedRequest } from '../../auth';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let invoiceService: InvoiceService;

  const mockInvoiceService = {
    getAllInvoices: jest.fn(),
    getInvoiceById: jest.fn(),
    getTotalAmountByDueDate: jest.fn(),
  };

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [{ provide: InvoiceService, useValue: mockInvoiceService }],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<InvoiceController>(InvoiceController);
    invoiceService = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllInvoices', () => {
    it('should return all invoices for the user', async () => {
      const invoices = [{ id: 1, amount: 100, user_id: mockUser.id }];
      mockInvoiceService.getAllInvoices.mockResolvedValue(invoices);

      const req = { user: mockUser } as AuthenticatedRequest;
      const query: GetAllInvoicesDto = { page: 1, limit: 10 };

      const result = await controller.getAllInvoices(req, query);
      expect(result).toEqual(invoices);
      expect(invoiceService.getAllInvoices).toHaveBeenCalledWith(
        mockUser.id,
        1,
        10,
      );
    });
  });

  describe('getInvoiceById', () => {
    it('should return a specific invoice for the user', async () => {
      const invoice = { id: 1, amount: 100, user_id: mockUser.id };
      mockInvoiceService.getInvoiceById.mockResolvedValue(invoice);

      const req = { user: mockUser } as AuthenticatedRequest;
      const params: GetInvoiceByIdParamsDto = { id: 1 };

      const result = await controller.getInvoiceById(req, params);
      expect(result).toEqual(invoice);
      expect(invoiceService.getInvoiceById).toHaveBeenCalledWith(
        1,
        mockUser.id,
      );
    });
  });

  describe('getTotalAmountByDueDate', () => {
    it('should return the total amount due for the user', async () => {
      const totalAmount = { _sum: { amount: 300 } };
      mockInvoiceService.getTotalAmountByDueDate.mockResolvedValue(totalAmount);

      const req = { user: mockUser } as AuthenticatedRequest;
      const query: GetTotalAmountByDueDateDto = { dueDate: new Date() };

      const result = await controller.getTotalAmountByDueDate(req, query);
      expect(result).toEqual(totalAmount);
      expect(invoiceService.getTotalAmountByDueDate).toHaveBeenCalledWith(
        mockUser.id,
        query.dueDate,
      );
    });
  });
});
