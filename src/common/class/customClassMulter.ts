import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Observable } from 'rxjs';

export class FileToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    if (req.body && req.file?.fieldname) {
      const { fieldname } = req.file;
      if (!req.body[fieldname]) {
        req.body[fieldname] = req.file;
      }
    }

    return next.handle();
  }
}

export class FilesToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    if (req.body) {
      if (req.file) {
        const { fieldname } = req.file;
        req.body[fieldname] = req.file;
      }
      if (req.files) {
        for (const fieldname in req.files) {
          if (!req.body[fieldname]) {
            req.body[fieldname] = [];
          }
          for (const file of req.files[fieldname]) {
            req.body[fieldname].push(file);
          }
        }
      }
    }

    return next.handle();
  }
}

export const ApiFile =
  (options?: ApiPropertyOptions): PropertyDecorator =>
  (target: Object, propertyKey: string | symbol) => {
    ApiProperty({
      ...options,
      type: 'file',
      properties: {
        [propertyKey]: {
          type: 'string',
          format: 'binary',
        },
      },
    })(target, propertyKey);
  };

export const ApiFiles =
  (options?: ApiPropertyOptions): PropertyDecorator =>
  (target: Object, propertyKey: string | symbol) => {
    ApiProperty({
      ...options,
      type: 'array',
      items: {
        type: 'file',
        properties: {
          [propertyKey]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey);
  };
