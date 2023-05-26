import { UserEntity } from '../entities/user.entity';

export type PublicUserEntity = Omit<UserEntity, 'password' | 'refreshToken'>;
