import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto{
  @IsEmail({},{message:'Please provide Email'})
  email:string;
  @IsNotEmpty({message:'Please provide the name'})
  @IsString({message:'Name must be string'})
  @MinLength(3,{message:'Name must be atleast 3 in character set'})
  name:string;
  @IsNotEmpty({message:'Please provide the password'})
  @MinLength(6,{message:'Name must be atleast 6 in character set'})
  password:string;
}