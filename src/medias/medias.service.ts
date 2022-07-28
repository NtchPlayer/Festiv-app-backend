import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { Express } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

//Service
import { FilesService } from './files.service';
import { UsersService } from '../users/users.service';

// Entity
import { Media } from './media.entity';
import { User } from '../users/user.entity';

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
    media.user = userInfos;

    try {
      await this.mediasRepository.save(media);
    } catch {
      throw new UnprocessableEntityException('An error has occurred');
    }
  }

  async addPublicationMedia(
    imageBuffer: Buffer,
    fileName: string,
    contentType: string,
  ) {
    return this.filesService.uploadFile(
      imageBuffer,
      fileName,
      'posts',
      contentType,
    );
  }
}
