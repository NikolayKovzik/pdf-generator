import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createUser(createUserDto: SignUpDto): Promise<UserEntity> {
    return this.usersRepository.save(createUserDto);
  }

  findAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findUserById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    console.log(updateUserDto);
    return this.usersRepository.save({
      id,
      ...updateUserDto,
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
