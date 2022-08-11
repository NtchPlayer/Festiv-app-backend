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

  async getPublicationMediasKey(id: number) {
    try {
      const medias = await this.mediasRepository.find({
        where: {
          publication: {
            id: id,
          },
        },
      });
      return medias.map((media) => {
        return {
          Key: media.key,
        };
      });
    } catch {
      throw new NotFoundException("Le média n'a pas été trouvé.");
    }
  }

  async deleteMediasOfPublication(
    parentId: number,
    comments: [{ id: number; parentPublicationId: number }],
  ) {
    const mediasToDelete = [];
    for (const comment of comments) {
      mediasToDelete.push(...(await this.getPublicationMediasKey(comment.id)));
    }
    mediasToDelete.push(...(await this.getPublicationMediasKey(parentId)));

    if (mediasToDelete.length === 0) {
      return;
    }
    await this.filesService.deleteFiles(mediasToDelete);
  }
}
