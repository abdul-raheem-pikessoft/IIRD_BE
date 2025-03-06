import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ExceptionMessageConstant } from '../../../../../constant/exception-message.constant';
import { UserService } from '../../users/user.service';
import { ResponseData } from 'src/types/response.type';
import { User } from '../../users/entities/user.entity';
import { Exception, UnauthorizedException, UnhandledException } from 'src/exceptions/custom-exception';
import { UserTokensService } from '../../user-tokens/user-tokens.service';
import { UserToken } from '../../user-tokens/entities/user-tokens.entity';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly userService: UserService, private readonly userTokenService: UserTokensService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_REFRESH_PRIVATE}`,
      passReqToCallback: true,
      algorithms: ['RS512'],
    });
  }

  async validate(req: Request, payload: any) {
    try {
      const refreshToken: string = req?.get('Authorization')?.replace('Bearer', '')?.trim();
      const isTokenExists: UserToken = await this.userTokenService.findToken({ token: refreshToken });
      if (!isTokenExists) {
        throw new UnauthorizedException(ExceptionMessageConstant.UNAUTHORIZED);
      }

      const response: ResponseData<User> = await this.userService.findOneByProperties({
        email: payload?.email,
        isActive: true,
      });

      const user = response as User;

      return { ...user, refreshToken };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw new UnauthorizedException(ExceptionMessageConstant.UNAUTHORIZED);
    }
  }
}
