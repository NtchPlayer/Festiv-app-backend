import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Tag } from '../tags/tag.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.findByEmail(createUserDto.email);
    if (isEmailExist) {
      throw new UnprocessableEntityException('Email already in use');
    }

    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.isProfessional = createUserDto.isProfessional;

    if (user.isProfessional) {
      user.tags = [];
      for (const tag of createUserDto.tags) {
        const tagEntity = new Tag();
        tagEntity.content = tag;
        tagEntity.user = user;
        user.tags.push(tagEntity);
        console.log(tagEntity);
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

  async showById(id: number): Promise<User> {
    const user = await this.findById(id);

    delete user.password;
    return user;
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOneByOrFail({ id });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async findByUsername(username: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          username,
        },
        select: {
          username: true,
          createdAt: true,
          biography: true,
          birthday: true,
          avatar: {
            url: true,
            alt: true,
          },
        },
      });
    } catch {
      throw new NotFoundException("This user don't exist.");
    }
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    user.username = data.username;
    user.email = data.email;
    user.birthday = data.birthday;

    return await this.usersRepository.save(user);
  }
}
