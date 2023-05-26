import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(userDto: SignUpDto) {
    const userExists = await this.usersService.findUserByEmail(userDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.usersService.createUser(userDto);
    const tokens = await this.getTokens(newUser.id);

    const publicUserData = await this.updateRefreshToken(
      newUser.id,
      tokens.refreshToken,
    );

    return {
      tokens,
      user: publicUserData,
    };
  }

  async signIn(data: SignInDto) {
    const userExists = await this.usersService.findUserByEmail(data.email);

    if (!userExists) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      userExists.password,
    );

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.getTokens(userExists.id);

    const publicUserData = await this.updateRefreshToken(
      userExists.id,
      tokens.refreshToken,
    );

    return {
      tokens,
      user: publicUserData,
    };
  }

  async logout(userId: number) {
    return this.usersService.updateRefreshToken(userId, null);
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, parseInt(process.env.CRYPT_SALT));
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return await this.usersService.updateRefreshToken(
      userId,
      hashedRefreshToken,
    );
  }

  async getTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('jwt.accessSecret'),
          expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateTokens(userId: number, oldRefreshToken: string) {
    const userExists = await this.usersService.findUserById(userId);
    if (!userExists || !userExists.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    // это по идее лучше делать в refresh strategy файле
    const refreshTokenMatches = await bcrypt.compare(
      oldRefreshToken,
      userExists.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const newTokens = await this.getTokens(userExists.id);

    const publicUserData = await this.updateRefreshToken(
      userExists.id,
      newTokens.refreshToken,
    );

    return {
      tokens: newTokens,
      user: publicUserData,
    };
  }
}
