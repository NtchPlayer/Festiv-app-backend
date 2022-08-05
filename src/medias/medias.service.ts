import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Express } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

//Service
import { FilesService } from './files.service';
import { UsersService } from '../users/users.service';

// Entity
import { Media } from './media.entity';
import { Publication } from '../publications/publication.entity';

@Injectable()
export class MediasService {
  constructor(
    @InjectRepository(Media)
    private mediasRepository: Repository<Media>,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
  ) {}

  async addUserAvatar(file: Express.Multer.File, userId: number) {
    const user = await this.usersService.findById(userId);
    console.log('user get:', user);
    const upload = await this.filesService.uploadFile(
      file.buffer,
      file.originalname,
      `users/${user.name}`,
      file.mimetype,
    );

    if (user.avatar) {
      await this.filesService.deleteFile(user.avatar.key);
      user.avatar.url = upload.Location;
      user.avatar.key = upload.Key;
      user.avatar.type = file.mimetype;
    } else {
      const media = new Media();
      media.url = upload.Location;
      media.key = upload.Key;
      media.type = file.mimetype;
      user.avatar = media;
    }
    try {
      console.log('before save', user);
      await this.usersService.saveAvatar(user);
      return user.avatar;
    } catch {
      throw new UnprocessableEntityException(
        "L'image de profile n'a pas pu être mise à jour.",
      );
    }
  }

  async addPublicationMedia(
    file: Express.Multer.File,
    publication: Publication,
  ) {
    const media = new Media();

    const upload = await this.filesService.uploadFile(
      file.buffer,
      file.originalname,
      `publications/${publication.folder}`,
      file.mimetype,
    );

    media.url = upload.Location;
    media.key = upload.Key;
    media.type = file.mimetype;
    media.publication = publication;

    try {
      await this.mediasRepository.save(media);
    } catch {
      throw new UnprocessableEntityException('An error has occurred');
    }
  }

  async deletePublicationMedia(id: number) {
    try {
      const publication = await this.mediasRepository.findOneBy({ id });
      await this.filesService.deleteFile(publication.key);
      return this.mediasRepository.delete(id);
    } catch {
      throw new NotFoundException('An error occur on delete media');
    }
  }
}
