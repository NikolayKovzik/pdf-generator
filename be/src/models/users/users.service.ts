import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { PublicUserEntity } from './types/types';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: SignUpDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.configService.get('cryptSalt'),
    );

    return this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  findAllUsers(): Promise<PublicUserEntity[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'image', 'pdf'],
    });
  }

  findUserById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  findPublicUserById(id: number): Promise<PublicUserEntity | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.image',
        'user.pdf',
      ])
      .where('user.id= :userId', { userId: id })
      .getOne();
  }

  updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<PublicUserEntity> {
    return this.usersRepository.save({
      id,
      ...updateUserDto,
    });
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string | null,
  ): Promise<PublicUserEntity> {
    const res = await this.usersRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ refreshToken })
      .where('id = :id', { id })
      .returning(['email', 'id', 'firstName', 'lastName', 'image', 'pdf'])
      .execute();
    return res.raw[0];
  }

  async deleteUser(id: number): Promise<PublicUserEntity> {
    const res = await this.usersRepository
      .createQueryBuilder('user')
      .delete()
      .where('id = :id', { id })
      .returning(['email', 'id', 'firstName', 'lastName', 'image', 'pdf'])
      .execute();

    return res.raw[0];
  }
}
