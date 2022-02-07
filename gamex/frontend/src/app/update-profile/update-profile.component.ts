import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../register/users.service';

import { Router } from "@angular/router";
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit, OnDestroy{
  
  userAuthenticate = false;
  private authListenerSubs: Subscription = Subscription.EMPTY;

  key=''
  value=''


  radioChangeHandler(event:any){
    this.key = event.target.value
  }

  updateForm(){
        
    var obj:any = {}
    const key = this.key
    const value = this.value
    obj[key] = value
    console.log(obj)

    this.userService.updateUser(obj).subscribe(data=>{
      console.log(data)},
      error=>{
        console.log(error)
      }
    )
    this.router.navigate(['/'])
  }

  constructor(public userService:UserService, private router: Router) { }

  ngOnInit(): void {
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
