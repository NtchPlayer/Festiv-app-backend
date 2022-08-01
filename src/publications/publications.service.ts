import {
  Injectable,
  NotFoundException,
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
import { Tag } from '../tags/tag.entity';

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

  private constructorQuerySearch(
    userId: number,
    name?: string,
    hashtag?: string,
    q?: string,
  ) {
    let searchQuery = '[nameSearch] [contentSearch] [hashtagSearch]';

    const separatorNameContent = name && q ? 'AND' : '';
    const separatorNameHashtag = name && !q && hashtag ? 'AND' : '';
    const separatorContentHashtag = q && hashtag ? 'AND' : '';

    const nameSearch = name
      ? `userTag.name = '${name}' ${separatorNameHashtag}`
      : '';
    const contentSearch = q
      ? `${separatorNameContent} publications.content LIKE '%${q}%'`
      : '';
    const hashtagSearch = hashtag
      ? `${separatorContentHashtag} tags.content = '${hashtag.toLowerCase()}'`
      : '';

    searchQuery = searchQuery
      .replace('[nameSearch]', nameSearch)
      .replace('[contentSearch]', contentSearch)
      .replace('[hashtagSearch]', hashtagSearch);

    if (!name && !hashtag && !q) {
      searchQuery = '1=1';
    }
    return this.performQuery(userId, searchQuery);
  }

  private async performQuery(userId: number, searchQuery: string) {
    let query = `
      SELECT
        publications.id,
        publications.createdAt,
        publications.content,
        GROUP_CONCAT(DISTINCT CONCAT(userPublication.id,',',userPublication.name,',',userPublication.username) SEPARATOR ';') AS users,
        GROUP_CONCAT(DISTINCT CONCAT(medias.url,',',medias.alt) SEPARATOR ';') AS medias,
        GROUP_CONCAT(DISTINCT CONCAT(tags.content,',',COALESCE(userTag.name, 'NULL')) SEPARATOR ';') AS tags,
        ISNULL(publications_user_likes_users.usersId) AS isLike
      FROM publications
      LEFT OUTER JOIN publications_user_likes_users ON publications_user_likes_users.publicationsId = publications.id AND publications_user_likes_users.usersId = ?
      LEFT JOIN publications_tags_tags ON publications_tags_tags.publicationsId = publications.id
      LEFT JOIN tags ON tags.id = publications_tags_tags.tagsId
      LEFT JOIN users AS userTag ON userTag.id = tags.userId
      INNER JOIN users AS userPublication ON userPublication.id = publications.userId
      LEFT JOIN medias ON medias.publicationId = publications.id
      WHERE [searchQuery]
      GROUP BY publications.id
      ORDER BY publications.createdAt DESC
    `;
    query = query.replace('[searchQuery]', searchQuery);

    const results = await this.publicationsRepository.query(query, [userId]);

    if (results.length === 0) {
      throw new NotFoundException();
    }

    for (const result of results) {
      result.tags = result.tags
        ? this.formattedElement(result.tags, ['content', 'name'])
        : null;
      result.medias = result.medias
        ? this.formattedElement(result.medias, ['url', 'alt'])
        : null;
      result.users = this.formattedElement(result.users, [
        'id',
        'name',
        'username',
      ]);
      result.isLike = result.isLike != 1;
    }

    return results;
  }

  private formattedElement(content: string, properties: string[]) {
    const objects = content.split(';');
    const array = [];
    for (const object of objects) {
      const value = object.split(',');
      const objectFill = {};
      properties.forEach((property, i) => {
        objectFill[property] = value[i];
      });
      array.push(objectFill);
    }
    return array;
  }

  async findAll(
    name: string,
    hashtag: string,
    q: string,
    userId: number,
  ): Promise<Publication[]> {
    return this.constructorQuerySearch(userId, name, hashtag, q);
  }

  async findByName(name: string, userId: number): Promise<Publication[]> {
    return await this.performQuery(userId, `userPublication.name = '${name}'`);
  }

  async findOne(id: number, userId: number): Promise<Publication> {
    return await this.performQuery(userId, `publications.id = '${id}'`);
  }

  async create(
    createPublicationDto: CreatePublicationDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    const publication = new Publication();
    const userInfos = await this.usersService.findById(userId);

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
      }
    }
    if (createPublicationDto.tags) {
      publication.tags = [];
      for (const tag of createPublicationDto.tags) {
        const tagFound = await this.tagsService.findOneByContent(tag);
        if (tagFound) {
          publication.tags.push(tagFound);
        } else {
          const tagEntity = new Tag();
          tagEntity.content = tag;
          publication.tags.push(tagEntity);
        }
      }
    }
    try {
      return await this.publicationsRepository.save(publication);
    } catch (e) {
      throw e;
    }
  }

  async likePublication(publicationId: number, userId: number) {
    try {
      const publication = await this.publicationsRepository.findOne({
        where: {
          id: publicationId,
        },
        relations: {
          userLikes: true,
        },
        select: {
          id: true,
          content: true,
          userLikes: {
            id: true,
            name: true,
            username: true,
          },
        },
      });
      const user = await this.usersService.findById(userId);
      if (!publication.userLikes) {
        publication.userLikes = [];
      }
      publication.userLikes.push(user);
      await this.publicationsRepository.save(publication);
      return 'success';
    } catch (err) {
      throw err;
    }
  }

  async unlikePublication(publicationId: number, userId: number) {
    try {
      const publication = await this.publicationsRepository.findOne({
        where: {
          id: publicationId,
        },
        relations: {
          userLikes: true,
        },
      });
      publication.userLikes = publication.userLikes.filter((user) => {
        return user.id !== userId;
      });
      await this.publicationsRepository.save(publication);
      return 'success';
    } catch {
      throw new NotFoundException('Impossible de trouver la publication.');
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

  async deleteOne(id: number, userId: number) {
    try {
      return this.publicationsRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .andWhere('userId = :userId', { userId })
        .execute();
    } catch {
      throw new UnprocessableEntityException("Can't delete publication");
    }
  }
}
