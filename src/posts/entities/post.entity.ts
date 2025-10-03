import { text } from "stream/consumers";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post{
  @PrimaryGeneratedColumn()
  id:number;
  @Column({length:50})
  title:string;
  @Column({type:'text'})
  content:string;
  @Column()
  authorName:string;
  @CreateDateColumn()
  createdAt:Date;
  @UpdateDateColumn()
  updatedAt:Date;

}