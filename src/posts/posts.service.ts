import { ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { Post as PostInterface } from './post.interface';
import { DatabaseSync } from 'node:sqlite';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { title } from 'process';
import { updatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private readonly postRepository:Repository<Post>){}
  async findAll(): Promise<Post[]> {
  return this.postRepository.find({
    relations: ['author'], 
  });
}

async findOne(id: number): Promise<Post> {
  const singlePost = await this.postRepository.findOne({
    where: { id },
    relations: ['author'], 
  });
  if (!singlePost) {
    throw new NotFoundException(`Post with id ${id} is not found`);
  }
  return singlePost;
}

async create(createPostData: CreatePostDto, author: User): Promise<Post> {
  const newPost = this.postRepository.create({
    title: createPostData.title,
    content: createPostData.content,
    author, 
  });
  return this.postRepository.save(newPost);
}

  async update(id:number,updatePostData :updatePostDto,user:User):Promise<Post>{
    const findPost=await this.findOne(id);
    if(findPost.author.id!==user.id && user.role!==UserRole.ADMIN){
      throw new ForbiddenException('You can only update your own post')
    }
    if(updatePostData.title){
      findPost.title=updatePostData.title;
    }
    if(updatePostData.content){
      findPost.content=updatePostData.content;
    }
    return this.postRepository.save(findPost);
    
  }
  async remove(id:number,user:User): Promise<Post>{
    const index= await this.findOne(id);
    if(index.author.id!==user.id && user.role!==UserRole.ADMIN){
      throw new ForbiddenException('You can only delete your own post')
    }
    return this.postRepository.remove(index);
  }

}
