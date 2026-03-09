import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateFlagDto } from './dto/create-flag.dto.js';

@Injectable()
export class FlagsService {
  constructor(private prisma: PrismaService) {}

  async createFlag(dto: CreateFlagDto) {
    const existing = await this.prisma.featureFlag.findUnique({
      where: {
        key_environment: {
          key: dto.key,
          environment: dto.environment,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Flag with key ${dto.key} exist`);
    }

    return this.prisma.featureFlag.create({
      data: {
        ...dto,
        rules: dto.rules,
      },
    });
  }

  async getFlag(key: string, environment: string, userRegion: string = '') {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { key_environment: { key, environment } },
    });

    if (!flag || !flag.isActive) return { enabled: false };

    const rules = flag.rules as any[];
    const matchingRule = rules.find((r) => r.region === userRegion);

    return {
      enabled: matchingRule ? matchingRule.enabled : flag.isActive,
    };
  }

  async getFlags() {
    const flags = await this.prisma.featureFlag.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
