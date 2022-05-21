import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  totalPosts: number = 0;
  postsPerPage: number = 3;
  currentPage: number = 1;
  pageSizeOptions: Array<number> = [1, 3, 5, 10]

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDeletePost(postId: string) {
    this.postsService
      .deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
  }

}
