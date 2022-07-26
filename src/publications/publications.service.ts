import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Publication } from './publication.entity';
import { User } from '../users/user.entity';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<Publication[]> {
    return this.publicationsRepository.find({
      select: {
        id: true,
        createdAt: true,
        content: true,
        media: true,
        user: {
          username: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Publication> {
    try {
      return await this.publicationsRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          user: true,
        },
        select: {
          id: true,
          createdAt: true,
          content: true,
          media: true,
          user: {
            username: true,
          },
        },
      });
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async create(createPublicationDto: CreatePublicationDto, user: User) {
    const publication = new Publication();
    const userInfos = await this.usersService.findById(user.id);

    publication.content = createPublicationDto.content;
    // publication.media = createPublicationDto.media;
    publication.user = userInfos;
    try {
      await this.publicationsRepository.save(publication);
    } catch {
      throw new UnprocessableEntityException('An error has occurred');
    }
  }

  async update(updatePublicationDto: UpdatePublicationDto, id: number) {
    try {
      const publication = await this.publicationsRepository.findOneBy({ id });

      publication.content = updatePublicationDto.content;
      // publication.media = updatePublicationDto.media;
      return this.publicationsRepository.save(publication);
    } catch (err) {
      throw new NotFoundException("This publication don't exist.");
    }
  }

  deleteOne(id: number) {
    return this.publicationsRepository.delete(id);
  }
}
