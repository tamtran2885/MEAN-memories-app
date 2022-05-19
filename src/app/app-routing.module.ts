import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostComponent } from "./posts/post/post.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";

const routes: Routes = [
  { path: "", component: PostComponent },
  { path: "create", component: PostCreateComponent },
  { path: "edit/:postId", component: PostCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
