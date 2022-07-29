import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Express } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

//Service
import { FilesService } from './files.service';
import { UsersService } from '../users/users.service';

// Entity
import { Media } from './media.entity';
import { User } from '../users/user.entity';
import { Publication } from '../publications/publication.entity';

@Injectable()
export class MediasService {
  constructor(
    @InjectRepository(Media)
    private mediasRepository: Repository<Media>,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
  ) {}

  async addUserAvatar(file: Express.Multer.File, user: User) {
    const media = new Media();
    const userInfos = await this.usersService.findById(user.id);

    const upload = await this.filesService.uploadFile(
      file.buffer,
      file.originalname,
      'avatars',
      file.mimetype,
    );

    media.url = upload.Location;
    media.key = upload.Key;
    media.type = file.mimetype;
    media.user = userInfos;

    try {
      await this.mediasRepository.save(media);
    } catch {
      throw new UnprocessableEntityException('An error has occurred');
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
