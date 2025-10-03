import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostExistPipe } from './post-exist-pipe';
import { Post as PostEntity } from './entities/post.entity';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService:PostsService){}
  @Get('/get-all-post')
  async findAll() : Promise<PostEntity[]>{
    return await this.postsService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe,PostExistPipe) id :number):Promise<PostEntity>{
    return await this.postsService.findOne(id);
  }
  @Post('/create-post')
  async create(@Body() createPostData: CreatePostDto):Promise<PostEntity>{
    return await this.postsService.create(createPostData);

  }
  @Put(':id')
  async update(@Param('id',ParseIntPipe,PostExistPipe) id:number, @Body() updatePostData:Partial<CreatePostDto>) :Promise<PostEntity>{
    return await this.postsService.update(id,updatePostData)
  }
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe,PostExistPipe) id:number) :Promise<PostEntity>{
   return await this.postsService.remove(id);
  }

}
