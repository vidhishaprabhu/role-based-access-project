import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private authservice:AuthService){
    super({
      jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:false,
      secretOrKey:'jwt_secret'

    })
  }
  async validate(payload:any){
    try{
      const user=this.authservice.getUserById(payload.id);
      return{
        id:(await user).id,
        email:(await user).email,
        name:(await user).name,
        role:payload.role
      }
    }
    catch(error){
      throw new UnauthorizedException('Invalid token')

    };
    
  }


}