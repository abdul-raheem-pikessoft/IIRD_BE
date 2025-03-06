import { ValidationError } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { instanceToPlain } from 'class-transformer';
import { MetadataStorage, getMetadataStorage } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { randomBytes } from 'crypto';
import dayjs from 'dayjs';
import * as dotenv from 'dotenv';
import { UserRolePermission } from 'src/routes/v1/user-role-permission/entities/user-role.entity';
import { User } from 'src/routes/v1/users/entities/user.entity';
import { PermissionWithRole, UserWithRolePermissions } from 'src/types/user.type';
import { forAdmin } from '../../constant';
import { PermissionsEnum } from '../enums/permissions.enum';
import { ForbiddenException, UnhandledException } from '../exceptions/custom-exception';
import { TokenAndExpiry } from '../types/global.types';
import { ExceptionMessageConstant } from '../../constant/exception-message.constant';
dotenv.config();

export class AppHelperService {
  static extractValidationMessage(errors: ValidationError[]): string[] {
    try {
      return errors?.map((error: ValidationError) => {
        let message: string = 'Invalid Input';

        if (error?.constraints) {
          message = Object.values(error?.constraints)?.[0];
        }

        return message;
      });
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  static generateToken(expiryTime: number): TokenAndExpiry {
    try {
      const token: string = randomBytes(16).toString('hex');

      const expiration: Date = new Date();
      expiration.setMinutes(expiration.getMinutes() + expiryTime);

      return {
        token,
        expiresAt: expiration,
      };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  static findTimeDifference(startDate: Date, endDate: Date): number {
    try {
      const dayjsStartDate: dayjs.Dayjs = dayjs(startDate);
      const dayjsEndDate: dayjs.Dayjs = dayjs(endDate);

      return dayjsEndDate?.diff(dayjsStartDate);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  static extractRolesPermissionFromUser(user: User): UserWithRolePermissions {
    try {
      const permissions: PermissionWithRole[] = [];
      const userRolePermissions: UserRolePermission[] = [];

      user?.userRolePermission?.forEach((object: UserRolePermission) => {
        if (object?.role?.rolePermission?.length) {
          object?.role?.rolePermission?.forEach((obj) => {
            permissions?.push({ ...obj?.permission, roleId: object?.roleId });
          });
        }

        if (object?.permission) {
          permissions?.push({ ...object?.permission, roleId: null });
        }

        if (object?.role) {
          delete object?.permission;
          delete object?.role?.rolePermission;
          delete object?.permissionId;
          userRolePermissions.push(object);
        }
      });

      const uniquePermissions: PermissionWithRole[] = permissions?.filter(
        (permission, index, self) => index === self?.findIndex((p) => p?.id === permission?.id && p?.name === permission?.name),
      );

      delete user?.userRolePermission;

      const serializedUser: User = instanceToPlain(user) as User;
      return { ...serializedUser, permissions: uniquePermissions, userRolePermissions };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  static generateSalt(): string {
    return bcryptjs.genSaltSync(10);
  }

  static hashPassword(password: string, salt: string): string {
    const combinedData: string = password + process.env.SECRET_KEY + salt;

    return bcryptjs.hashSync(combinedData, salt);
  }

  static verifyPassword(enteredPassword: string, storedHashedPassword: string, salt: string): boolean {
    const combinedData: string = enteredPassword + process.env.SECRET_KEY + salt;

    return bcryptjs.compareSync(combinedData, storedHashedPassword);
  }

  static verifyPermissions(
    permissions: PermissionsEnum[],
    requester: UserWithRolePermissions,
    ownerId: number,
    body?: any,
    dtoType?: any,
  ): boolean {
    const hasPermission: boolean = permissions?.every((permission) => requester?.permissions?.some((p) => p?.name === permission));

    if (!hasPermission && requester && ownerId !== requester?.id) {
      throw new ForbiddenException(ExceptionMessageConstant.INSUFFICIENT_PERMISSIONS);
    }

    if (!hasPermission && requester && body && dtoType) {
      this.removeAdminFields(body, dtoType);
    }

    return true;
  }

  static removeAdminFields(body: any, dtoType: any) {
    const metaData: MetadataStorage = getMetadataStorage();
    const fields: ValidationMetadata[] = metaData?.getTargetValidationMetadatas(dtoType, '', false, false);
    const adminFields: string[] = fields?.filter((field) => field?.name === forAdmin)?.map((field) => field?.propertyName);

    adminFields?.forEach((field: string) => {
      delete body[field];
    });
  }
}
