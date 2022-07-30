import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Request,
} from '@nestjs/common';

import { TagsService } from './tags.service';
import { CreateTagDto } from './dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('add')
  async create(@Request() req, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.add(createTagDto, req.user.userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tagsService.deleteOne(id, req.user.userId);
  }
}
