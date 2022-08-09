import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User } from './user.entity';
import { Media } from '../medias/media.entity';
import { Tag } from '../tags/tag.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { TagsService } from '../tags/tags.service';
import { FilesService } from '../medias/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Media)
    private readonly mediasRepository: Repository<Media>,
    private readonly tagsService: TagsService,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.findByEmail(createUserDto.email);
    if (isEmailExist) {
      throw new UnprocessableEntityException('Email is use');
    }

    const isNameExist = await this.findByName(createUserDto.name);
    if (isNameExist) {
      throw new UnprocessableEntityException('Name is use');
    }

    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.password = createUserDto.password;
    user.isProfessional = createUserDto.isProfessional;

    if (user.isProfessional) {
      user.tags = [];
      for (const tag of createUserDto.tags) {
        const tagEntity = new Tag();
        tagEntity.content = tag.content;
        user.tags.push(tagEntity);
      }
    }
    const userSave = await this.usersRepository.save(user);
    delete user.password;
    return userSave;
  }

  public async validateCredentials(
    user: User,
    password: string,
  ): Promise<boolean> {
    return compare(password, user.password);
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { id },
      relations: {
        avatar: true,
        tags: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        avatar: true,
      },
    });
  }

  async findFestivals() {
    return this.usersRepository.find({
      relations: {
        tags: true,
      },
      where: {
        isProfessional: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        tags: {
          id: true,
          content: true,
        },
      },
    });
  }

  async findByName(name: string) {
    return await this.usersRepository.findOne({
      where: {
        name,
      },
      relations: {
        tags: true,
        avatar: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
        biography: true,
        birthday: true,
        isProfessional: true,
        avatar: {
          id: true,
          url: true,
          alt: true,
        },
        tags: {
          id: true,
          content: true,
        },
      },
    });
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { tags: true },
      select: {
        id: true,
        username: true,
        email: true,
        birthday: true,
        biography: true,
        tags: {
          id: true,
          content: true,
        },
      },
    });

    user.username = data.username;
    user.email = data.email;
    user.birthday = data.birthday;
    user.biography = data.biography;
    if (data.tags) {
      const newTag = [];
      for (const tag of data.tags) {
        const searchTag = await this.tagsService.findOneByContent(tag.content);
        if (searchTag?.user && searchTag.user.id !== userId) {
          throw new UnprocessableEntityException(
            `Le hashtag ${tag.content} est déjà utilisé par le compte ${searchTag.user.name}.`,
          );
        } else if (searchTag) {
          newTag.push(searchTag);
        } else {
          const tagEntity = new Tag();
          tagEntity.content = tag.content;
          tagEntity.id = tag.id;
          newTag.push(tagEntity);
        }
      }
      user.tags = newTag;
    }
    try {
      return await this.usersRepository.save(user);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async saveAvatar(user) {
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        avatar: true,
      },
      select: {
        avatar: {
          key: true,
        },
      },
    });
    const mediasToDelete = await this.mediasRepository.find({
      where: {
        publication: {
          user: {
            id,
          },
        },
      },
      relations: {
        publication: {
          user: true,
        },
      },
      select: {
        key: true,
        publication: {},
      },
    });
    await this.filesService.deleteFile(user.avatar.key);
    await this.filesService.deleteFiles(
      mediasToDelete.map((media) => {
        return {
          Key: media.key,
        };
      }),
    );
    return this.usersRepository.delete(id);
  }
}
