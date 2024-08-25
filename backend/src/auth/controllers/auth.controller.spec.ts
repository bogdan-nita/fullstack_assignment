/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from '../dtos';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should throw BadRequestException if login data is invalid', async () => {
    const invalidBody: Partial<LoginDto> = { email: 'invalid' }; // Incomplete data

    // Mock login to throw an error explicitly
    mockAuthService.login.mockImplementation(() => {
      throw new BadRequestException('Invalid login data');
    });

    await expect(
      controller.login(invalidBody as any, mockResponse as any as Response),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if auth service throws', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };

    // Mock the login to throw a BadRequestException
    mockAuthService.login.mockRejectedValueOnce(
      new BadRequestException('Invalid credentials'),
    );

    await expect(
      controller.login(loginDto, mockResponse as any as Response),
    ).rejects.toThrow(BadRequestException);
  });
});
