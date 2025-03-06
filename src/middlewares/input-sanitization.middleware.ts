import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { filterXSS } from 'xss';
import structuredClone from '@ungap/structured-clone';
export class InputSanitizationMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: (error?: any) => void) {
    if (!req.body) {
      next();
    }

    const input = structuredClone(req.body);

    for (const key in input) {
      if (typeof input[key] === 'string') {
        const sanitizedInput = filterXSS(input[key], { stripIgnoreTag: true });
        if (sanitizedInput !== input[key]) {
          input[key] = sanitizedInput;
        }
      }
    }

    if (JSON.stringify(input) !== JSON.stringify(req.body)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Invalid Input' });
    }
    next();
  }
}
