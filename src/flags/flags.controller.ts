import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FlagsService } from './flags.service.js';
import {
  CreateFlagDto,
  type Environment,
  EnvironmentEnum,
  UpdateFlagDto,
} from './dto/flags.dto.js';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Post('create')
  create(@Body() dto: CreateFlagDto) {
    return this.flagsService.createFlag(dto);
  }

  @Get()
  findAll(
    @Query('env', new ZodValidationPipe(EnvironmentEnum.optional()))
    env?: Environment,
  ) {
    return this.flagsService.getFlags(env);
  }

  @Get(':key')
  findOne(
    @Param('key') key: string,
    @Query('env', new ZodValidationPipe(EnvironmentEnum)) env: Environment,
    @Query('region') region: string,
  ) {
    return this.flagsService.getFlag(key, env || 'dev', region || '');
  }

  @Patch(':key')
  update(
    @Param('key') key: string,
    @Query('env', new ZodValidationPipe(EnvironmentEnum)) env: Environment,
    @Body() dto: UpdateFlagDto,
  ) {
    return this.flagsService.updateFlag(key, env || '', dto);
  }

  @Delete(':key')
  remove(
    @Param('key') key: string,
    @Query('env', new ZodValidationPipe(EnvironmentEnum)) env: Environment,
  ) {
    return this.flagsService.deleteFlag(key, env);
  }
}
