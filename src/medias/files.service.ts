import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  private _s3: S3;
  constructor() {
    this._s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  public async uploadFile(
    imageBuffer: Buffer,
    fileName: string,
    folder: string,
    contentType?: string,
  ) {
    return this._s3
      .upload({
        Bucket: process.env.AWS_BUCKET,
        Body: imageBuffer,
        Key: `${folder}/${uuid()}-${fileName}`,
        ContentType: contentType,
        ACL: 'public-read',
      })
      .promise()
      .then((r) => {
        return r;
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      });
  }

  public async deleteFile(key: string) {
    return this._s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
      })
      .promise()
      .then((r) => {
        return r;
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      });
  }
}
