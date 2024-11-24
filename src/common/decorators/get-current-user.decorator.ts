import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from 'src/types';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies['refresh_token'];
    
    if (data === 'refreshToken') {
      return refreshToken;
    }

    if (!data) return request.user;
    return request.user[data];
  },
);
