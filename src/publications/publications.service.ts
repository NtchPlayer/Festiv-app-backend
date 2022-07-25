import {
  Injectable,
  // NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Publication } from './publication.entity';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private postsRepository: Repository<Publication>,
  ) {}

  async findAll(): Promise<Publication[]> {
    return this.postsRepository.find({
      select: {
        id: true,
        createdAt: true,
        content: true,
        media: true,
        user: {
          username: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Publication> {
    return this.postsRepository.findOneOrFail({
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        media: true,
        user: {
          username: true,
        },
      },
    });
  }

  // async create(createUserDto: CreatePostDto) {
  //   const post = new Publication();
  //   post.content = createUserDto.username;
  //   post.media = createUserDto.email;
  //   post.user = createUserDto.password;
  //
  //   try {
  //     await this.findByEmail(createUserDto.email);
  //   } catch (err) {
  //     await this.usersRepository.save(user);
  //     delete user.password;
  //     return user;
  //   }
  //   throw new UnprocessableEntityException('Email already in use');
  // }
}
