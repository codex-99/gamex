import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../register/users.service';

import { Router } from "@angular/router";
import {Subscription} from 'rxjs';
import {Order} from './order.model'

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit, OnDestroy {
  userAuthenticate = false
  orders:Order[] = []

  totalPost = 10;
  postsPerPage = 1;
  index = 0
  
  private authListenerSubs: Subscription = Subscription.EMPTY;

  delete(orderId:string){
    this.userService.deleteOrders(orderId).subscribe(data=>{
      console.log(data);
    })
    this.router.navigate(['/'])
  }

  constructor(private userService: UserService, private router: Router) { }

  onChangePage(pageInfo:PageEvent){
    this.index = pageInfo.pageIndex;
    console.log(pageInfo.pageIndex);
  }


  ngOnInit(){
    this.userService.getOrders()
    .subscribe(data => {
      this.orders = data;
      this.totalPost = this.orders.length;
      console.log(this.orders.length);
    })


    this.userAuthenticate = this.userService.getIsAuth();

    this.authListenerSubs = this.userService.getAuthStatus()
      .subscribe(isAuthenticated =>{
        this.userAuthenticate = isAuthenticated
      })
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }

}
