import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateFlagDto } from './dto/create-flag.dto.js';

@Injectable()
export class FlagsService {
  constructor(private prisma: PrismaService) {}

  async createFlag(dto: CreateFlagDto) {
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

    if (!flag?.isActive) return { enabled: false };

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

    return flags;
  }

  async updateFlag(key: string, environment: string, data: any) {
    return await this.prisma.featureFlag.update({
      where: {
        key_environment: { key, environment },
      },
      data: {
        ...data,
        ...(data.rules && { rules: data.rules as any }),
      },
    });
  }

  async deleteFlag(key: string, environment: string) {
    return await this.prisma.featureFlag.delete({
      where: { key_environment: { key, environment } },
    });
  }
}
