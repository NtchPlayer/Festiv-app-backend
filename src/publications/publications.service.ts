import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';

// Entity
import { Publication } from './publication.entity';
import { Media } from '../medias/media.entity';
import { User } from '../users/user.entity';

// Service
import { FilesService } from '../medias/files.service';
import { UsersService } from '../users/users.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  async findAll(name: string): Promise<Publication[]> {
    try {
      return this.publicationsRepository.find({
        relations: {
          user: true,
          medias: true,
        },
        where: {
          user: {
            name: name,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        select: {
          id: true,
          createdAt: true,
          content: true,
          user: {
            name: true,
            username: true,
            id: true,
          },
          medias: {
            url: true,
            alt: true,
          },
        },
      });
    } catch {
      throw new NotFoundException();
    }
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
            name: true,
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
    if (files) {
      publication.medias = [];
      publication.folder = uuid();
      for (const file of files) {
        const mediaEntity = new Media();
        const upload = await this.filesService.uploadFile(
          file.buffer,
          file.originalname,
          `publications/${publication.folder}`,
          file.mimetype,
        );
        mediaEntity.url = upload.Location;
        mediaEntity.key = upload.Key;
        mediaEntity.type = file.mimetype;
        publication.medias.push(mediaEntity);
        console.log(mediaEntity);
      }
    }
    if (createPublicationDto.tags) {
      publication.tags = [];
      for (const tag of createPublicationDto.tags) {
        console.log(tag);
        const tagFound = await this.tagsService.findOneByContent(tag);
        console.log(tagFound);
        if (tagFound) {
          publication.tags.push(tagFound);
        }
      }
    }
    try {
      return await this.publicationsRepository.save(publication);
    } catch (e) {
      throw e;
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
            key: true,
          },
        },
      });
      if (publication.user.id === parseInt(userId)) {
        for (const file of publication.medias) {
          await this.filesService.deleteFile(file.key);
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
