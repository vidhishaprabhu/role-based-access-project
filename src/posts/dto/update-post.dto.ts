import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
export class updatePostDto{
    @IsOptional()
    @IsNotEmpty({message:'Title is required'})
    @IsString({message:'Title must be string'})
    @MinLength(3,{message:'Tile must be atleast 3 in character set'})
    title?:string;
    @IsOptional()
    @IsNotEmpty({message:'Content is required'})
    @IsString({message:'Content must be string'})
    @MinLength(3,{message:'Content must be atleast 3 in character set'})
    content?:string;
    @IsOptional()
    @IsNotEmpty({message:'author-name is required'})
    @IsString({message:'author-name must be string'})
    @MinLength(3,{message:'author-name must be atleast 3 in character set'})
    authorName?:string
}