import { Component, OnDestroy, OnInit} from '@angular/core';
import { Product } from '../post.model';
import { PostsService } from '../post.service';
import {Subscription} from 'rxjs';


import {UserService} from "../../register/users.service"

@Component({
  selector: 'app-postCreate',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  userAuthenticate = false
  private authListenerSubs: Subscription = Subscription.EMPTY;


  products: Product[] = [];

  constructor(public postService: PostsService, private userService: UserService) { }

  shop(productName:string){
    // console.log("PID: "+id)
    this.userService.sendOrders(productName)
  }
  
  ngOnInit() {
    this.postService.getProducts().subscribe(data=>{
      this.products = data
      console.log(this.products)
    }) 

    this.userAuthenticate = this.userService.getIsAuth();

    this.authListenerSubs = this.userService.getAuthStatus()
      .subscribe(isAuthenticated =>{
        this.userAuthenticate = isAuthenticated
      })
    
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe()
  }

 

}
