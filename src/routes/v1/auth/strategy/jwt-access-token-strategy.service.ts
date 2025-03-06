import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UserService } from '../../users/user.service';
import { ExceptionMessageConstant } from '../../../../../constant/exception-message.constant';
import { ResponseData } from 'src/types/response.type';
import { Exception, UnauthorizedException, UnhandledException } from 'src/exceptions/custom-exception';
import { Request } from 'express';
import { UserToken } from '../../user-tokens/entities/user-tokens.entity';
import { UserTokensService } from '../../user-tokens/user-tokens.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UserService, private readonly userTokenService: UserTokensService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.PRIVATE_KEY}`,
      algorithms: ['RS512'],
      passReqToCallback: true,
    });
  }

  /**
   * @description Validate the token and return the user
   * @param payload string
   * @returns User
   */
  async validate(req: Request, payload: User): Promise<User> {
    try {
      const accessToken: string = req?.get('Authorization')?.replace('Bearer', '')?.trim();
      const isTokenExists: UserToken = await this.userTokenService.findToken({ token: accessToken });

      if (!isTokenExists) {
        throw new UnauthorizedException(ExceptionMessageConstant.UNAUTHORIZED);
      }

      const response: ResponseData<User> = await this.usersService.findOneWithPermissions({
        email: payload?.email,
        isActive: true,
      });

      return response as User;
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw new UnauthorizedException(ExceptionMessageConstant.UNAUTHORIZED);
    }
  }
}
