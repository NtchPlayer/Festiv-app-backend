import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Tag } from './tag.entity';
import { CreateTagDto, UpdateTagDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = new Tag();

    tag.content = createTagDto.content;
    tag.user = createTagDto.user;
    try {
      return await this.tagsRepository.save(tag);
    } catch {
      throw new UnprocessableEntityException('An error has occurred');
    }
  }

  async update(updateTagDto: UpdateTagDto, id: number) {
    try {
      const tag = await this.tagsRepository.findOneBy({ id });

      tag.content = updateTagDto.content;
      // publication.media = updatePublicationDto.media;
      return this.tagsRepository.save(tag);
    } catch (err) {
      throw new NotFoundException("This tag don't exist.");
    }
  }
}
