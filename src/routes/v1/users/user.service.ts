import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { FindAllQueryResponse, ListingResponseData, MessageResponse, ResponseData } from 'src/types/response.type';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { UserTokenTypeEnum } from '../../../enums/user.enum';
import { DuplicateException, Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { AppHelperService } from '../../../helpers/app.helper';
import { UserMailer } from '../../../mailer/services/user-mailer.service';
import { UserWithRolePermissions } from '../../../types/user.type';
import { Permission } from '../permissions/entities/permissions.entity';
import { UpdateUserPermissionDto } from '../user-role-permission/dto/update-user-permission.dto';
import { UpdateUserRoleDto } from '../user-role-permission/dto/update-user-role.dto';
import { UserRolePermission } from '../user-role-permission/entities/user-role.entity';
import { UserRolePermissionService } from '../user-role-permission/user-role-permission.service';
import { UserToken } from '../user-tokens/entities/user-tokens.entity';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { PermissionsEnum } from '../../../enums/permissions.enum';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userTokenService: UserTokensService,
    private readonly userRolePermissionService: UserRolePermissionService,
    private readonly userMailer: UserMailer,
  ) {}

  async create(body: CreateUserDto): Promise<ResponseData<MessageResponse>> {
    try {
      let password: string;
      let salt: string;

      if (body.password) {
        salt = AppHelperService.generateSalt();
        password = AppHelperService.hashPassword(body?.password, salt);
      }

      const user: User = await this.userRepository.saveUser({ ...body, password, isActive: false, salt } as User);

      if (body.roles && body.roles.length > 0) {
        await this.userRolePermissionService.assignRoles({ userId: user.id, roles: body.roles });
      }

      if (body.permissions && body.permissions.length > 0) {
        await this.userRolePermissionService.assignPermissions({ userId: user.id, permissions: body.permissions });
      }
      await this.userMailer.userRegister(user);

      return { message: ResponseMessageConstant.USER_CREATED };
    } catch (err) {
      if (err?.message?.includes(ExceptionMessageConstant.DUPLICATE)) {
        throw new DuplicateException(ExceptionMessageConstant.EMAIL_EXISTS);
      }

      throw err;
    }
  }

  async createWithSocialId(body: LoginUserDto): Promise<User> {
    try {
      const socialProvider = `${body?.socialProvider}SocialId`;

      const user: User = await this.userRepository.saveUser({
        ...body,
        [socialProvider]: body?.socialId,
        isActive: true,
      } as unknown as User);

      return user;
    } catch (err) {
      if (err.message?.includes(ExceptionMessageConstant.DUPLICATE)) {
        throw new DuplicateException(ExceptionMessageConstant.EMAIL_EXISTS);
      }
      throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneWithPermissions(props: Partial<User>): Promise<ResponseData<UserWithRolePermissions>> {
    try {
      const user: User = await this.userRepository.findOneByProp(props);
      if (user) {
        return AppHelperService.extractRolesPermissionFromUser(user);
      }

      throw new NotFoundException(ExceptionMessageConstant.USER_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async findAll(): Promise<ListingResponseData<User>> {
    try {
      const [users, count]: FindAllQueryResponse<User> = await this.userRepository.findAll();
      const usersWithPermissions: User[] = users?.map((user) => {
        const permissions: Permission[] = user?.userRolePermission?.filter((item) => item?.permissionId).map((item) => item?.permission);

        const filteredUserRolePermissions: UserRolePermission[] = user?.userRolePermission?.filter((item) => item?.roleId);

        return {
          ...(instanceToPlain(user) as User),
          userRolePermission: filteredUserRolePermissions,
          permissions: permissions,
        };
      });

      return { count, records: usersWithPermissions };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async findOneByProperties(props: Partial<User>, requester?: UserWithRolePermissions): Promise<ResponseData<User>> {
    try {
      const user = await this.userRepository.findOneByProp(props);

      if (user) {
        AppHelperService.verifyPermissions([PermissionsEnum.VIEW_USER], requester, user?.id);

        return user;
      }

      throw new NotFoundException(ExceptionMessageConstant.USER_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
  async findUserWithExcludedProperties(props: Partial<User>): Promise<ResponseData<User>> {
    try {
      const user: User = await this.userRepository.findOneWithExcludedProperties(props);
      if (user) {
        return user;
      }

      throw new NotFoundException(ExceptionMessageConstant.USER_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async update(
    id: number,
    data: Partial<UpdateUserDto & User>,
    requester?: UserWithRolePermissions,
  ): Promise<ResponseData<MessageResponse>> {
    try {
      const existingUser: User = await this.userRepository.findOneByProp({ id });

      if (!existingUser) throw new NotFoundException(ExceptionMessageConstant?.USER_NOT_FOUND);

      AppHelperService.verifyPermissions([PermissionsEnum.UPDATE_USER], requester, id, data, UpdateUserDto);

      if (data?.password) {
        data.password = AppHelperService.hashPassword(data?.password, data?.salt);
        await this.userTokenService.deleteAllUserTokens(existingUser?.id);
      }

      Object.keys(data).forEach((key) => {
        existingUser[key] = data[key];
      });

      await this.userRepository.saveUser(existingUser);

      if (data.deleteRoles && data.newRoles) {
        await this.userRolePermissionService.updateUserRoles(data as UpdateUserRoleDto, existingUser.id);
      }
      if (data.deletePermissions && data.newPermissions) {
        await this.userRolePermissionService.updateUserPermissions(data as UpdateUserPermissionDto, existingUser.id);
      }

      return { message: ResponseMessageConstant.USER_UPDATED };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async remove(id: number): Promise<ResponseData<MessageResponse>> {
    try {
      const response: ResponseData<User> = await this.userRepository.findOneByProp({ id });
      const existingUser = response as User;

      if (!existingUser) throw new NotFoundException(ExceptionMessageConstant?.USER_NOT_FOUND);

      await this.userTokenService.deleteAllUserTokens(existingUser?.id);
      await this.userRepository.deleteBy({ id });

      return { message: ResponseMessageConstant.USER_REMOVED };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
  async verifyEmail(email: string): Promise<ResponseData<MessageResponse>> {
    try {
      const responseData: ResponseData<User> = await this.findOneByProperties({ email });
      const user = responseData as User;
      user.isActive = true;
      await this.userRepository.saveUser(user);

      return { message: ResponseMessageConstant.USER_VERIFIED };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async generateOTP(existingUser: User, type: UserTokenTypeEnum): Promise<string> {
    try {
      const otp: string = process.env.NODE_ENV === 'test' ? '0000' : (Math.floor(Math.random() * 9000) + 1000).toString();
      const otpExpiryTime: number = parseInt(process.env.OTP_EXPIRY_TIME, 10);
      const expiresAt: Date = new Date(new Date().getTime() + otpExpiryTime * 60 * 1000);
      const userToken: UserToken = {
        userId: existingUser?.id,
        token: otp,
        expiresAt,
        type,
      } as UserToken;

      await this.userTokenService.storeToken(userToken);

      return otp;
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  findOne(props: Partial<User>): Promise<User> {
    return this.userRepository.findOneByProp(props);
  }
}
