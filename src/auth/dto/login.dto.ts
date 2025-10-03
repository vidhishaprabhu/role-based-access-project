import { IsEmail, IsNotEmpty,MinLength } from "class-validator";

export class LoginDto{
  @IsEmail({},{message:'Please provide Email'})
  email:string;
  @IsNotEmpty({message:'Please provide the password'})
  @MinLength(6,{message:'Name must be atleast 6 in character set'})
  password:string;
}