import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    // костыль, по хорошему этого кода не должно быть
    // без этого выходит 500 error
    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
       if(err || !user) {
           throw err || new UnauthorizedException();
       } 

       return user;
    }
}