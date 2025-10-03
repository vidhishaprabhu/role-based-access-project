import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGauard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/currrent-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from './guards/roles.guard';
import * as bcrypt from 'bcrypt';
//Created the controller for auth
@Controller('auth')
export class AuthController {
  constructor(private authService:AuthService){bcrypt.hash('vidisha@123',3).then(console.log)}
  @Post('register')
  register(@Body() registerdto:RegisterDto){
    return this.authService.register(registerdto);
  }
  @Post('login')
  login(@Body() logindto:LoginDto){
    return this.authService.login(logindto);
  }
  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken:string){
    return this.authService.refreshToken(refreshToken);
  }
  @UseGuards(JwtAuthGauard)
  @Get('profile')
  getProfile(@CurrentUser() user:any){
    return user;
  }
  @Post('create-admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGauard,RolesGuard)
  createAdmin(@Body() registerDto:RegisterDto){
    return this.authService.createAdmin(registerDto);
  }
}
