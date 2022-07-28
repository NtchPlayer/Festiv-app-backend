import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Publication } from './publication.entity';
import { MediasService } from '../medias/medias.service';
import { User } from '../users/user.entity';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Express } from 'express';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
    private readonly mediaService: MediasService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Publication[]> {
    return this.publicationsRepository.find({
      relations: {
        user: true,
        medias: true,
      },
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        user: {
          username: true,
        },
        medias: {
          url: true,
          alt: true,
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
          medias: true,
        },
        select: {
          id: true,
          createdAt: true,
          content: true,
          user: {
            username: true,
          },
          medias: {
            url: true,
            alt: true,
          },
        },
      });
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async create(
    createPublicationDto: CreatePublicationDto,
    files: Express.Multer.File[],
    user: User,
  ) {
    const publication = new Publication();
    const userInfos = await this.usersService.findById(user.id);

    publication.content = createPublicationDto.content;
    publication.user = userInfos;
    const publicationPost = await this.publicationsRepository.save(publication);
    try {
      for (const file of files) {
        await this.mediaService.addPublicationMedia(file, publicationPost);
      }
      return publicationPost;
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

  async deleteOne(id: number, userId: string) {
    try {
      const publication = await this.publicationsRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          user: true,
          medias: true,
        },
        select: {
          user: {
            id: true,
          },
          medias: {
            id: true,
            key: true,
          },
        },
      });
      if (publication.user.id === parseInt(userId)) {
        for (const file of publication.medias) {
          await this.mediaService.deletePublicationMedia(file.id);
        }
        return this.publicationsRepository.delete(id);
      } else {
        throw new UnauthorizedException();
      }
    } catch {
      throw new NotFoundException("This publication don't exist.");
    }
  }
}
