import { HttpStatus } from '@nestjs/common';

export class Exception extends Error {
  message: string;
  status: number;
  additionalArgs: (number | string)[];

  constructor(message: string, status: number = 400, additionalArgs: (number | string)[] = []) {
    super(message);
    this.message = message;
    this.status = status;
    this.additionalArgs = additionalArgs;
  }

  getStatus(): number {
    return this.status;
  }

  getMessage(): string {
    return this.message;
  }

  getResponse(): this {
    return this;
  }
}

export class DuplicateException extends Exception {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends Exception {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class UnhandledException extends Exception {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ForbiddenException extends Exception {
  constructor(message: string, additionalArgs?: (number | string)[]) {
    super(message, HttpStatus.FORBIDDEN, additionalArgs);
  }
}
