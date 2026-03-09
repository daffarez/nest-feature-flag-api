import { Body, Controller, Post } from '@nestjs/common';
import { FlagsService } from './flags.service.js';
import { CreateFlagDto } from './dto/create-flag.dto.js';

@Controller('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Post()
  create(@Body() dto: CreateFlagDto) {
    return this.flagsService.createFlag(dto);
  }
}
