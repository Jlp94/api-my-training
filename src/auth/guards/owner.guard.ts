import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = request.params.id;

    if (user?.role === 'admin') {
      return true;
    }

    if (user?.userId !== paramId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este recurso.',
      );
    }

    return true;
  }
}
