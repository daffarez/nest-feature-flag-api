import { Test, TestingModule } from '@nestjs/testing';
import { FlagsService } from './flags.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FlagsService', () => {
  let service: FlagsService;
  let prisma: PrismaService;

  const mockPrisma = {
    featureFlag: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<FlagsService>(FlagsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getFlags', () => {
    it('should return an array of flags and call prisma with correct filter', async () => {
      const mockResult = [{ key: 'test', environment: 'dev' }];
      mockPrisma.featureFlag.findMany.mockResolvedValue(mockResult);

      const result = await service.getFlags('dev' as any);

      expect(result).toEqual(mockResult);

      expect(prisma.featureFlag.findMany).toHaveBeenCalledWith({
        where: { environment: 'dev' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getFlag', () => {
    it('should return enabled: true when region matches rule', async () => {
      const mockData = {
        key: 'promo-id',
        isActive: true,
        rules: [{ region: 'ID', enabled: true }],
      };

      mockPrisma.featureFlag.findUnique.mockResolvedValue(mockData);

      const result = await service.getFlag('promo-id', 'dev' as any, 'ID');

      expect(result).toEqual({ enabled: true });
    });

    it('should throw NotFoundException when flag does not exist', async () => {
      mockPrisma.featureFlag.findUnique.mockResolvedValue(null);

      await expect(service.getFlag('wrong-key', 'dev' as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
