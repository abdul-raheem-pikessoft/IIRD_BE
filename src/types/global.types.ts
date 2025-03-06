import { LanguageEnum } from '../enums/language.enum';
import { SocialProviderEnum } from '../enums/social-provider-type.enum';
import { UserTokenTypeEnum } from 'src/enums/user.enum';

export type PrimitiveType<T> = {
  [K in keyof T]: T[K] extends string | number | boolean | Date | LanguageEnum | SocialProviderEnum
    ? T[K]
    : never;
};

export type TokenAndExpiry = { token: string; expiresAt: Date };
export type OtpAndExpiry = { otp: string; expiresAt: Date };
export type FindTokenType = { userId: number; type: UserTokenTypeEnum; key: string };
export type ThrottlerStorageType = { totalHits: number; timeToExpire: number };
