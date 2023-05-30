import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { PublicUserEntity } from './entities/public-user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { promises as fsPromises } from 'fs';
import * as PdfMake from 'pdfmake';

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
    RETURNING "id", "email", "firstName", "lastName", "image";
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
      select: ['id', 'email', 'firstName', 'lastName', 'image'],
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
    RETURNING "id", "email", "firstName", "lastName", "image";
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
    SELECT "id", "email", "firstName", "lastName", "image"
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
      .returning(['id', 'email', 'firstName', 'lastName', 'image'])
      .execute();

    return res.raw[0];
  }

  async uploadImage(
    id: number,
    file: Express.Multer.File,
  ): Promise<PublicUserEntity> {
    console.log(file);
    const query = `
    WITH updated_user AS (
      UPDATE "user"
      SET "image" = $1
      WHERE "id" = $2
      RETURNING *
    )
    SELECT "id", "email", "firstName", "lastName", "image"
    FROM updated_user;
  `;
    const hostName = this.configService.get('hostName');
    const port = this.configService.get('port');
    const fileName = file.filename;
    const imageSrc = `${hostName}:${
      port ? port : ''
    }/assets/avatars/${fileName}`;
    const [updatedUser] = await this.usersRepository.query(query, [
      imageSrc,
      id,
    ]);

    return updatedUser;
  }

  async generatePDF(id: number, response: Response) {
    const user = await this.findUserById(id);
    const imageBuffer = await fsPromises.readFile(
      './public/assets/avatars/firstback-1685365165763-983680438.png',
    );
    const dataURL = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const documentDefinition = {
      content: [
        {
          text: 'User Information',
          style: 'header',
          fontSize: 25,
          marginBottom: 40,
          alignment: 'center',
        },
        {
          columns: [
            { image: dataURL, width: 100, height: 100 },
            {
              stack: [
                { text: `First Name:   ${user.firstName}`, marginBottom: 10 },
                { text: `Last Name:   ${user.lastName}` },
              ],
              alignment: 'left',
              marginLeft: 50,
            },
          ],
        },
      ],
      defaultStyle: {
        font: 'Helvetica',
      },
    };

    const options = {};
    const printer = new PdfMake(fonts);
    const pdfDoc = printer.createPdfKitDocument(documentDefinition, options);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      'attachment; filename=downloaded.pdf',
    );
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
