import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository:Repository<User>,
private jwtService:JwtService){}
  async register(registerdto:RegisterDto){
    const existingUser=await this.userRepository.findOne({where:{email:registerdto.email}});
    if(existingUser){
    throw new BadRequestException("Email already in use. Please try again !!");
    }
    const hashedpassword=await this.hashpassword(registerdto.password);
    const newlycreateduser=await this.userRepository.create({
      email:registerdto.email,
      name:registerdto.name,
      password:hashedpassword,
      role:UserRole.USER
    })
    const saveUser=await this.userRepository.save(newlycreateduser);
    const {password,...result}=saveUser;
    return {
      user:result,
      message:'Registration is successfull. Please login to continue'
    }
  }
  private async hashpassword(password:string) : Promise<string>{
      return bcrypt.hash(password,10);
  }
  async createAdmin(registerdto:RegisterDto){
    const existingUser=await this.userRepository.findOne({where:{email:registerdto.email}});
    if(existingUser){
    throw new BadRequestException("Email already in use. Please try again !!");
    }
    const hashedpassword=await this.hashpassword(registerdto.password);
    const newlycreateduser=await this.userRepository.create({
      email:registerdto.email,
      name:registerdto.name,
      password:hashedpassword,
      role:UserRole.ADMIN
    })
    const saveUser=await this.userRepository.save(newlycreateduser);
    const {password,...result}=saveUser;
    return {
      user:result,
      message:'Admin user created successfully. Please login to continue'
    }

  }
  async login(logindto:LoginDto){
    const user=await this.userRepository.findOne({where:{email:logindto.email}});
    if(!user || !(await this.verifyPassword(logindto.password,user.password))){
      throw new UnauthorizedException('Invalid Credentials');
    }
    const {password,...result}=user
    return{
      user:result,
      token:this.generateTokens(user)
    }
  }
  private async verifyPassword(plainPassword:string,hashedPassword:string):Promise<boolean>{
    return bcrypt.compare(plainPassword,hashedPassword);
  }
  private generateTokens(user:User){
    return {
      accessToken:this.generateAccessToken(user),
      refreshToken:this.generateRefreshToken(user)
    }
  }
  
  private generateAccessToken(user:User):string{
    const payload={
      email:user.email,
      id:user.id,
      role:user.role
    }
    return this.jwtService.sign(payload,{
      secret:'jwt_secret',
      expiresIn:'15m'
    });
  }
  async getUserById(userId:number){
    const user=await this.userRepository.findOne({where:{id:userId}})
    if(!user){
      throw new UnauthorizedException('User not found');
    }
    const {password,...result}=user;
    return result;
  }
  private generateRefreshToken(user:User):string{
    const payload={
      id:user.id
    }
    return this.jwtService.sign(payload,{
      secret:'refresh_secret',
      expiresIn:'7d'
    });
  }
  async refreshToken(refreshToken: string) {
  try {
    const payload = this.jwtService.verify(refreshToken, { secret: 'refresh_secret' });

    const user = await this.userRepository.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException("Invalid User");
    }

    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  } catch (e) {
    throw new UnauthorizedException('Invalid token');
  }
}

  
}

