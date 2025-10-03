import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostExistPipe } from './post-exist-pipe';
import { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGauard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/currrent-user.decorator';
import { userInfo } from 'os';
import { updatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
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
  @UseGuards(JwtAuthGauard)
  @Post('/create-post')
  async create(@Body() createPostData: CreatePostDto,@CurrentUser() user:any):Promise<PostEntity>{
    return await this.postsService.create(createPostData,user);

  }
  @UseGuards(JwtAuthGauard)
  @Put(':id')
  async update(@Param('id',ParseIntPipe,PostExistPipe) id:number, @Body() updatePostData:updatePostDto,@CurrentUser() user:any) :Promise<PostEntity>{
    return await this.postsService.update(id,updatePostData,user)
  }
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGauard,RolesGuard)
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe,PostExistPipe) id:number,@CurrentUser() user:any) :Promise<PostEntity>{
   return await this.postsService.remove(id,user);
  }

}
