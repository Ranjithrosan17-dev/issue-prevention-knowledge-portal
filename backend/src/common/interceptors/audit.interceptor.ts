import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
          console.log(`[AUDIT] ${user?.id} | ${method} ${url} | ${Date.now() - now}ms`);
        }
      }),
    );
  }
}
