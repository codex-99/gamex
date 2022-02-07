import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from "./users.service"
import {User} from "./users.model"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  

  checkFunc(form: NgForm){
    if(form.invalid){
      return
    }
    const users = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      age: form.value.age
    }
    console.log(users)
    this.userService.addUsers(users)
    form.resetForm()
  }

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    
  }

}