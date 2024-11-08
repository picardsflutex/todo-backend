import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from '@nestjs/jwt';
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/role-auth.decorator";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private jwtService:JwtService,
    private reflector: Reflector,
    private config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext):
  boolean | Promise<boolean> | Observable<boolean> {
    try {
      const reqRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ])
      
      if(!reqRoles){
        return true;
      }

      const req = context.switchToHttp().getRequest()
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]

      if(bearer !== 'Bearer' || !token){
        throw new UnauthorizedException({message: 'User is not authorized.'})
      }

      const user = this.jwtService.verify(token, {secret: this.config.get<string>('AT_SECRET')});
      req.user = user;
      const roleMatched = reqRoles.some(role => user.role === role);

      return roleMatched;
    } catch (error) {
      throw new HttpException('User have not access.', HttpStatus.FORBIDDEN)
    }
  }
}