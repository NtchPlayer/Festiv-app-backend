import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileAvatarPipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException(
        'Validation failed (type mine not authorized)',
      );
    }
    if (parseFloat((file.size / 1000000).toPrecision(3)) > 20) {
      throw new BadRequestException('Validation failed (file size exceed)');
    }
    return file;
  }
}
