// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import * as bcrypt from 'bcrypt';
// import { AuthDto } from './dto/auth.dto';
// import {
//   BadRequestException,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
// import { UserDto } from '../users/dto/user.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//     private configService: ConfigService,
//   ) {}

//   async signUp(userDto: UserDto) {
//     const userExists = await this.usersService.getUserByEmail(userDto.email);
//     if (userExists) {
//       throw new BadRequestException('User already exists');
//     }

//     const newUser = await this.usersService.createUser(userDto);
//     const tokens = await this.getTokens(
//       newUser._id.toString(),
//       newUser.username,
//     );

//     await this.updateRefreshToken(newUser._id.toString(), tokens.refreshToken);

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, ...publicUserData } = JSON.parse(JSON.stringify(newUser));

//     return {
//       tokens,
//       user: publicUserData,
//     };
//   }

//   async signIn(data: AuthDto) {
//     const userExists = await this.usersService.getUserByEmail(data.email);

//     if (!userExists) {
//       throw new BadRequestException('User does not exist');
//     }

//     const passwordMatches = await bcrypt.compare(
//       data.password,
//       userExists.password,
//     );

//     if (!passwordMatches) {
//       throw new BadRequestException('Password is incorrect');
//     }

//     const tokens = await this.getTokens(
//       userExists._id.toString(),
//       userExists.username,
//     );

//     await this.updateRefreshToken(
//       userExists._id.toString(),
//       tokens.refreshToken,
//     );

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, refreshToken, ...publicUserData } = JSON.parse(
//       JSON.stringify(userExists),
//     );

//     return {
//       tokens,
//       user: publicUserData,
//     };
//   }

//   async logout(userId: string) {
//     return this.usersService.partialUpdateUser(userId, { refreshToken: null });
//   }

//   async hashData(data: string) {
//     return await bcrypt.hash(data, parseInt(process.env.CRYPT_SALT));
//   }

//   async updateRefreshToken(userId: string, refreshToken: string) {
//     const hashedRefreshToken = await this.hashData(refreshToken);
//     await this.usersService.partialUpdateUser(userId, {
//       refreshToken: hashedRefreshToken,
//     });
//   }

//   async getTokens(userId: string, username: string) {
//     const [accessToken, refreshToken] = await Promise.all([
//       this.jwtService.signAsync(
//         {
//           sub: userId,
//           username,
//         },
//         {
//           secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
//           expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
//         },
//       ),
//       this.jwtService.signAsync(
//         {
//           sub: userId,
//           username,
//         },
//         {
//           secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
//           expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
//         },
//       ),
//     ]);

//     return {
//       accessToken,
//       refreshToken,
//     };
//   }

//   async refreshTokens(userId: string, oldRefreshToken: string) {
//     const userExists = await this.usersService.findById(userId);
//     if (!userExists || !userExists.refreshToken) {
//       throw new ForbiddenException('Access Denied');
//     }

//     // это по идее лучше делать в refresh strategy файле
//     const refreshTokenMatches = await bcrypt.compare(
//       oldRefreshToken,
//       userExists.refreshToken,
//     );

//     if (!refreshTokenMatches) {
//       throw new ForbiddenException('Access Denied');
//     }

//     const newTokens = await this.getTokens(
//       userExists._id.toString(),
//       userExists.username,
//     );

//     await this.updateRefreshToken(
//       userExists._id.toString(),
//       newTokens.refreshToken,
//     );

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, refreshToken, ...publicUserData } = JSON.parse(
//       JSON.stringify(userExists),
//     );

//     return {
//       tokens: newTokens,
//       user: publicUserData,
//     };
//   }
// }
