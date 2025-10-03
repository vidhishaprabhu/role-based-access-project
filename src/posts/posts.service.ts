import { Injectable, NotFoundException} from '@nestjs/common';
import { Post as PostInterface } from './post.interface';
import { DatabaseSync } from 'node:sqlite';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { title } from 'process';
import { updatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private readonly postRepository:Repository<Post>){}
  async findAll() : Promise<Post[]>{
    return this.postRepository.find();

  }
  async findOne(id:number):Promise<Post>{
    const singlePost =await this.postRepository.findOneBy({id})
    if(!singlePost){
      throw new NotFoundException(`Post with id ${id} is not found`);
    }
    return singlePost;
  }
  async create(createPostData: CreatePostDto): Promise<Post> {
  const newPost= this.postRepository.create({title:createPostData.title,content:createPostData.content,authorName:createPostData.authorName})
  await this.postRepository.save(newPost);
  return newPost;
}

  async update(id:number,updatePostData :updatePostDto):Promise<Post>{
    const findPost=await this.findOne(id);
    if(updatePostData.title){
      findPost.title=updatePostData.title;
    }
    if(updatePostData.content){
      findPost.content=updatePostData.content;
    }
    if(updatePostData.authorName){
      findPost.authorName=updatePostData.authorName;
    }
    return this.postRepository.save(findPost);
    
  }
  async remove(id:number): Promise<Post>{
    const index= await this.findOne(id);
    return this.postRepository.remove(index);
  }

}
