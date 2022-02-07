import { Component, OnDestroy, OnInit } from '@angular/core';

import {UserService} from "../register/users.service"
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userAuthenticate = false
  private authListenerSubs: Subscription = Subscription.EMPTY;

  constructor(private userService: UserService) { }

  onLogout(){
    this.userService.logout();
  }

  ngOnInit(){
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
