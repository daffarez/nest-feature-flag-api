import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FlagsService } from './flags.service.js';
import { CreateFlagDto } from './dto/create-flag.dto.js';

@Controller('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Post('create')
  create(@Body() dto: CreateFlagDto) {
    return this.flagsService.createFlag(dto);
  }

  @Get()
  findAll() {
    return this.flagsService.getFlags();
  }

  @Get(':key')
  findOne(
    @Param('key') key: string,
    @Query('env') env: string,
    @Query('region') region: string,
  ) {
    return this.flagsService.getFlag(key, env || 'dev', region || '');
  }

  @Patch(':key')
  update(
    @Param('key') key: string,
    @Query('env') env: string,
    @Body() dto: any,
  ) {
    return this.flagsService.updateFlag(key, env || '', dto);
  }
}
