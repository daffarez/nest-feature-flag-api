import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateFlagDto,
  type Environment,
  FlagRulesDto,
  UpdateFlagDto,
} from './dto/flags.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class FlagsService {
  constructor(private prisma: PrismaService) {}

  async createFlag(dto: CreateFlagDto) {
    return this.prisma.featureFlag.create({
      data: {
        ...dto,
        rules: dto.rules as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async getFlag(
    key: string,
    environment: Environment,
    userRegion: string = '',
  ) {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { key_environment: { key, environment } },
    });

    if (!flag) {
      throw new NotFoundException(
        `Flag with key '${key}' in '${environment}' not found`,
      );
    }

    if (!flag?.isActive) return { enabled: false };

    const rules = flag.rules as unknown as FlagRulesDto[];
    const matchingRule = rules.find((r) => r.region === userRegion);

    return {
      enabled: matchingRule ? matchingRule.enabled : flag.isActive,
    };
  }

  async getFlags(environment?: Environment) {
    return await this.prisma.featureFlag.findMany({
      where: {
        ...(environment && { environment }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateFlag(key: string, environment: Environment, data: UpdateFlagDto) {
    return await this.prisma.featureFlag.update({
      where: {
        key_environment: { key, environment },
      },
      data: {
        ...data,
        ...(data.rules && {
          rules: data.rules as unknown as Prisma.InputJsonValue,
        }),
      },
    });
  }

  async deleteFlag(key: string, environment: Environment) {
    return await this.prisma.featureFlag.delete({
      where: { key_environment: { key, environment } },
    });
  }
}
