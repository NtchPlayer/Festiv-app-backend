import {
  Injectable,
  // NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from './user.entity';
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
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    try {
      await this.findByEmail(createUserDto.email);
    } catch (err) {
      await this.usersRepository.save(user);
      delete user.password;
      return user;
    }
    throw new UnprocessableEntityException('Email already in use');
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
    return await this.usersRepository.findOneByOrFail({ email });
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    user.username = data.username;
    user.email = data.email;
    user.birthday = data.birthday;

    return await this.usersRepository.save(user);
  }
}
