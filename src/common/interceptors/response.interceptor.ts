import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: number;
  message: string;
  error: string | null;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const message = this.reflector.get<string>(
      'response_message',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => ({
        status: context.switchToHttp().getResponse().statusCode,
        message: message || 'OK',
        error: null,
        data,
      })),
    );
  }
}
