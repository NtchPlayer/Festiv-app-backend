import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File[],
  ): Express.Multer.File | Express.Multer.File[] {
    if (files.length === 0) {
      return;
    }
    if (
      !files.every((file) =>
        file.originalname
          .toLowerCase()
          .match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|m4v|avi)$/),
      )
    ) {
      throw new BadRequestException(
        'Validation failed (type mine not authorized)',
      );
    }
    const fileType = files[0].mimetype.split('/')[0];
    if (!files.every((file) => file.mimetype.split('/')[0] === fileType)) {
      throw new BadRequestException('Validation failed (send video and image)');
    }
    if (files.length > 2) {
      throw new BadRequestException(
        'Validation failed (more than 2 files send)',
      );
    }
    if (
      files.every(
        (file) => parseFloat((file.size / 1000000).toPrecision(3)) > 10, // MegaOctet
      )
    ) {
      throw new BadRequestException('Validation failed (files size exceed)');
    }
    return files;
  }
}
