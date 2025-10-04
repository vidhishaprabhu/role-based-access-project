import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { PostsService } from "./posts.service";
@Injectable()
export class PostExistPipe implements PipeTransform{
  constructor(private readonly postService:PostsService){}
  transform(value: any, metadata: ArgumentMetadata) {
    try{
        // this.postService.findOne(value);
    }
    catch(e){
      throw new NotFoundException(`Post not found for Id ${value}`)
    }
    return value;
  }
}