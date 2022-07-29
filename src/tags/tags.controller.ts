import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';

import { TagsService } from './tags.service';
import { UpdateTagDto } from './dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // @Get('/')
  // getAll(@Query('username') username?: string) {
  //   console.log(username);
  //   return this.publicationsService.findAll(username);
  // }
  //
  // @Get('/:id')
  // getOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.publicationsService.findOne(id);
  // }

  @Put('/:id')
  async update(
    @Body() updateTagDto: UpdateTagDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tagsService.update(updateTagDto, id);
  }

  // @Delete('/:id')
  // async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
  //   return this.publicationsService.deleteOne(id, req.user.userId);
  // }
}
