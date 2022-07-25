import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Delete,
} from '@nestjs/common';

import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Publication } from './publication.entity';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  getAll(): Promise<Publication[]> {
    return this.publicationsService.findAll();
  }

  @Get('/:id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicationsService.findOne(id);
  }

  // @Post('/add')
  // async create(@Body() createUserDto: CreatePostDto) {
  //   const user = await this.publicationsService.create(createUserDto);
  // }
  //
  // @Post('/update')
  // async update(@Request() req, @Body() data: UpdatePostDto) {
  //   return this.publicationsService.updateUser(req.user.userId, data);
  // }
  //
  // @Delete('/:id')
  // async delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.publicationsService.delete(id);
  // }
}
