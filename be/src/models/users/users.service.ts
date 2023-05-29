import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { PublicUserEntity } from './entities/public-user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<PublicUserEntity> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.configService.get('cryptSalt'),
    );

    const query = `
    INSERT INTO "user" ("email", "firstName", "lastName", "password")
    VALUES ($1, $2, $3, $4)
    RETURNING "id", "email", "firstName", "lastName", "image", "pdf";
  `;

    const [createdUser] = await this.usersRepository.query(query, [
      createUserDto.email,
      createUserDto.firstName,
      createUserDto.lastName,
      hashedPassword,
    ]);

    return createdUser;
  }

  findAllUsers(): Promise<PublicUserEntity[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'image', 'pdf'],
    });
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

  findUserById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<PublicUserEntity> {
    const columnNames = Object.keys(updateUserDto);
    const fieldValues = Object.values(updateUserDto);

    if (columnNames['password']) {
      columnNames['password'] = await bcrypt.hash(
        updateUserDto.password,
        this.configService.get('cryptSalt'),
      );
    }

    const query = `
    UPDATE "user"
    SET ${columnNames
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ')}
    WHERE "id" = $${columnNames.length + 1}
    RETURNING "id", "email", "firstName", "lastName", "image", "pdf";
  `;

    const [updatedUser] = await this.usersRepository.query(query, [
      ...fieldValues,
      id,
    ]);

    return updatedUser;
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string | null,
  ): Promise<PublicUserEntity> {
    const query = `
    WITH updated_user AS (
      UPDATE "user"
      SET "refreshToken" = $1
      WHERE "id" = $2
      RETURNING *
    )
    SELECT "id", "email", "firstName", "lastName", "image", "pdf"
    FROM updated_user;
  `;

    const [updatedUser] = await this.usersRepository.query(query, [
      refreshToken,
      id,
    ]);

    return updatedUser;
  }

  async deleteUser(id: number): Promise<PublicUserEntity> {
    const res = await this.usersRepository
      .createQueryBuilder('user')
      .delete()
      .where('id = :id', { id })
      .returning(['id', 'email', 'firstName', 'lastName', 'image', 'pdf'])
      .execute();

    return res.raw[0];
  }
}
