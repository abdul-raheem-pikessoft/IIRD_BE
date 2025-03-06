import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './entities/user-tokens.entity';
import { DeleteResult, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { PrimitiveType } from '../../../types/global.types';

@Injectable()
export class UserTokenRepository {
  constructor(@InjectRepository(UserToken) private readonly repository: Repository<UserToken>) {}

  findOneByProp(token: Partial<UserToken>): Promise<UserToken> {
    return this.repository.findOne({ relations: { user: true }, where: { ...(token as FindOptionsWhere<typeof token>) } });
  }

  findAllByUserId(userId: number): Promise<UserToken[]> {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  createToken(token: Partial<UserToken>): UserToken {
    return this.repository.create(token);
  }

  createOtp(otp: Partial<UserToken>): UserToken {
    return this.repository.create(otp);
  }

  saveToken(token: UserToken): Promise<UserToken> {
    return this.repository.save(token);
  }

  saveOtp(otp: UserToken): Promise<UserToken> {
    return this.repository.save(otp);
  }

  softRemoveOneBy(token: UserToken): Promise<UserToken> {
    return this.repository.softRemove(token);
  }

  softRemoveAllBy(token: UserToken[]): Promise<UserToken[]> {
    return this.repository.softRemove(token);
  }

  deleteAll(tokens: UserToken[]): Promise<UserToken[]> {
    return this.repository.remove(tokens);
  }

  remove(token: UserToken): Promise<UserToken> {
    return this.repository.remove(token);
  }

  findOne(userTokens: Partial<UserToken>): Promise<UserToken> {
    return this.repository.findOne({ where: { ...(userTokens as FindOptionsWhere<PrimitiveType<UserToken>>) } });
  }

  saveUserTokens(userTokens: Partial<UserToken[]>, transactionManager?: EntityManager): Promise<UserToken[]> {
    if (transactionManager) {
      return transactionManager.save(UserToken, userTokens);
    }

    return this.repository.save(userTokens);
  }

  removeUserToken(userTokens: UserToken[]): Promise<UserToken[]> {
    return this.repository.remove(userTokens);
  }

  removeByUuid(uuid: string, transactionManager?: EntityManager): Promise<DeleteResult> {
    if (transactionManager) {
      return transactionManager.delete(UserToken, uuid);
    }

    return this.repository.delete({ uuid });
  }
}
