import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ControllerNameEnum } from '../../../enums/global.enum';
import { UserOtpTypeEnum, UserTokenTypeEnum } from '../../../enums/user.enum';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { MessageResponse, ResponseData } from '../../../types/response.type';
import { LoginResponse } from '../../../types/user.type';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ResetPasswordWithOtpDto } from './dto/reset-password-with-otp.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { NoAuth } from './strategy/no-auth.guard';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller(ControllerNameEnum.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginUserDto): Promise<MessageResponse | LoginResponse> {
    try {
      return await this.authService.login(body);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @HttpCode(HttpStatus.OK)
  @NoAuth()
  @Post('verify-otp/:type')
  @ApiParam({ name: 'type', enum: UserOtpTypeEnum })
  async verifyOtp(@Param('type') type: UserTokenTypeEnum, @Body() body: VerifyOtpDto): Promise<ResponseData<LoginResponse>> {
    try {
      return await this.authService.verifyOtp(body, type);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @NoAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.authService.register(body);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  async me(@Req() req: Request): Promise<ResponseData<User>> {
    try {
      const user: User = req?.user as User;

      return await this.authService.me({ id: user.id, email: user.email } as User);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @HttpCode(HttpStatus.OK)
  @NoAuth()
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDTO): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.authService.forgotPassword(body?.email);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @HttpCode(HttpStatus.OK)
  @NoAuth()
  @Post('forgot-password-otp')
  async forgotPasswordWithOtp(@Body() body: ForgotPasswordDTO): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.authService.forgotPasswordWithOtp(body?.email);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @HttpCode(HttpStatus.OK)
  @NoAuth()
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDTO): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.authService.setOrResetPassword(body, UserTokenTypeEnum.FORGOT_PASSWORD_TOKEN);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @HttpCode(HttpStatus.OK)
  @NoAuth()
  @Post('set-password')
  async setPassword(@Body() body: ResetPasswordDTO): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.authService.setOrResetPassword(body, UserTokenTypeEnum.SET_PASSWORD);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @HttpCode(HttpStatus.OK)
  @NoAuth()
  @Post('reset-password-otp')
  async resetPasswordWithOtp(@Body() body: ResetPasswordWithOtpDto): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.authService.resetPasswordWithOtp(body);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request): Promise<ResponseData<MessageResponse>> {
    try {
      const token: string = req?.get('Authorization')?.replace('Bearer', '')?.trim();
      return await this.authService.logout(token);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @NoAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Req() req: Request): Promise<ResponseData<LoginResponse>> {
    try {
      const user: User = req?.user as User;
      return await this.authService.refreshTokens(user.id);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }
}
