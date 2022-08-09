import {
  Controller,
  Param,
  ParseIntPipe,
  Delete,
  Request,
} from '@nestjs/common';

import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tagsService.deleteOne(id, req.user.userId);
  }
}
