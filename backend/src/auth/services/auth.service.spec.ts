/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: User = {
        id: 1,
        name: 'Test User',
        email,
        password: 'hashedpassword',
      };

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);
      mockUserService.findOne.mockResolvedValueOnce(user);

      const result = await service.validate(email, password);
      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });

    it('should throw InvalidCredentialsException if user does not exist', async () => {
      const email = 'test@example.com';
      const password = 'password';
      mockUserService.findOne.mockResolvedValueOnce(null);

      await expect(service.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InvalidCredentialsException if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const user: User = {
        id: 1,
        name: 'Test User',
        email,
        password: 'hashedpassword',
      };

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
      mockUserService.findOne.mockResolvedValueOnce(user);

      await expect(service.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('createToken', () => {
    it('should create a JWT token', async () => {
      const userData = { id: 1, name: 'Test User', email: 'test@example.com' };
      const token = 'jwt-token';

      mockJwtService.sign.mockReturnValueOnce(token);

      const result = await service.createToken(userData);
      expect(result).toEqual(token);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userData.id,
        name: userData.name,
        email: userData.email,
      });
    });
  });

  describe('login', () => {
    it('should return a token and user data if login is successful', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: 1, name: 'Test User', email };
      const token = 'jwt-token';

      jest.spyOn(service, 'validate').mockResolvedValueOnce(user);
      jest.spyOn(service, 'createToken').mockResolvedValueOnce(token);

      const result = await service.login(email, password);
      expect(result).toEqual({ token, user });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      jest
        .spyOn(service, 'validate')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(service.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
