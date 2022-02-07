import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {UserService} from '../register/users.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  email = ''
  password =''
  constructor(public userService:UserService) { }

  

  checkFunc(form: NgForm){
    if(form.invalid){
      return
    }
    const users = {
      email: form.value.email,
      password: form.value.password
    }
    this.userService.login(users)
    form.resetForm();
  }


  ngOnInit(): void {
  }

}
