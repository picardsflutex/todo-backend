import { Role } from "@prisma/client";

export type JwtPayload = {
  email: string;
  id: number;
  role: Role;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };