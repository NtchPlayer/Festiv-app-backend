import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Tag } from './tag.entity';
// import { CreateTagDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async findOneByContent(content: string) {
    return this.tagsRepository.findOne({
      where: {
        content: content.toLowerCase(),
      },
      relations: {
        user: true,
      },
      select: {
        id: true,
        content: true,
        user: {
          id: true,
          name: true,
          username: true,
        },
      },
    });
  }

  // async add(createTagDto: CreateTagDto, userId: number) {
  //   const tag = new Tag();
  //
  //   tag.content = createTagDto.content;
  //   tag.user = await this.usersService.findById(userId);
  //   try {
  //     return await this.tagsRepository.save(tag);
  //   } catch {
  //     throw new UnprocessableEntityException('An error has occurred');
  //   }
  // }

  async deleteOne(id: number, userId: number) {
    try {
      const tag = await this.tagsRepository.findOne({
        where: { id },
        relations: { user: true },
        select: {
          user: {
            id: true,
          },
        },
      });
      if (tag.user.id == userId) {
        return this.tagsRepository.delete(id);
      } else {
        throw new UnprocessableEntityException(
          "Vous n'êtes pas autorisé supprimer ce tag",
        );
      }
    } catch (err) {
      throw new NotFoundException("This tag don't exist.");
    }
  }
}
