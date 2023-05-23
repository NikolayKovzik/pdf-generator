import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    //?вообще по идее нужно всё это вынести в отдельную функцию validate в auth service
    // тут нужно искать юзера в базе (по id)
    // затем сверять токен(ы) в базе и токен который пришел
    // бросать анауторайзд если чет не то
    // возвращать юзера (с айдишником) если всё ок
    // далее в эндпоинтах уже через @Req получать id
    return payload;
  }
}
