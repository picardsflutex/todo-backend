import { User } from '@prisma/client';

export type JwtPayload = Omit<User, 'password_hash'>;

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };