import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from 'src/types';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    // Проверка наличия refresh_token в cookies, если требуется
    const refreshToken = request.cookies['refresh_token'];
    
    // Если нужен refresh_token
    if (data === 'refreshToken') {
      return refreshToken;
    }

    // Возвращаем пользователя или данные из user, если data указано
    if (!data) return request.user;
    return request.user[data];
  },
);
