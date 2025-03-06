import { RoleEnum } from 'src/enums/role.enum';
import * as dotenv from 'dotenv';
dotenv.config();

export const REQ_RATE_LIMITING_BY_METHOD = {
  GET: {
    name: 'GET',
    limit: +process.env.GET_REQ_LIMIT,
    ttl: +process.env.GET_REQ_REFRESH_TIME,
  },
  POST: {
    name: 'POST',
    limit: +process.env.POST_REQ_LIMIT,
    ttl: +process.env.POST_REQ_REFRESH_TIME,
  },
  PUT: {
    name: 'PUT',
    limit: +process.env.PUT_REQ_LIMIT,
    ttl: +process.env.PUT_REQ_REFRESH_TIME,
  },
  DELETE: {
    name: 'DELETE',
    limit: +process.env.DELETE_REQ_LIMIT,
    ttl: +process.env.DELETE_REQ_REFRESH_TIME,
  },
  PATCH: {
    name: 'PATCH',
    limit: +process.env.PATCH_REQ_LIMIT,
    ttl: +process.env.PATCH_REQ_REFRESH_TIME,
  },
};

export const REQ_RATE_LIMITING_BY_ROLE = {
  [RoleEnum.ADMIN]: {
    name: RoleEnum.ADMIN,
    limit: +process.env.ADMIN_ROLE_REQ_LIMIT,
    ttl: +process.env.ADMIN_ROLE_REQ_REFRESH_TIME,
  },
  [RoleEnum.USER]: {
    name: RoleEnum.USER,
    limit: +process.env.STANDARD_ROLE_REQ_LIMIT,
    ttl: +process.env.STANDARD_ROLE_REQ_REFRESH_TIME,
  },
};

export const REQ_RATE_LIMITING_BY_IP = {
  limit: +process.env.IP_REQ_LIMIT,
  ttl: +process.env.IP_REQ_REFRESH_TIME,
};
