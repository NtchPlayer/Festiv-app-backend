import { Injectable } from '@nestjs/common';

import { FilesService } from './files.service';

@Injectable()
export class MediasService {
  constructor(private readonly filesService: FilesService) {}

  async addAvatar(imageBuffer: Buffer, fileName: string, contentType: string) {
    return this.filesService.uploadFile(
      imageBuffer,
      fileName,
      'avatars',
      contentType,
    );
  }

  async addPostImage(
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
