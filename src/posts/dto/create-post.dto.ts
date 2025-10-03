import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreatePostDto{
  @IsNotEmpty({message:'Title is required'})
  @IsString({message:'Title must be string'})
  @MinLength(3,{message:'Tile must be atleast 3 in character set'})
  title:string;
  @IsNotEmpty({message:'Content is required'})
  @IsString({message:'Content must be string'})
  @MinLength(3,{message:'Content must be atleast 3 in character set'})
  content:string;
  



}