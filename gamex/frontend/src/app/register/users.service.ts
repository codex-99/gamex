import { Injectable } from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import { Subject } from "rxjs";

import {Order} from "../view-orders/order.model"

import {User} from "./users.model"
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class UserService {
    private users: User[] = [];
    private token:string = '';
    public data: any = {};

    private isAuth = false;
    private authStatusListener = new Subject<boolean>();
    private orders: User[] = [];
    private orderUpdated = new Subject<User []>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuth;
    }

    getAuthStatus(){
        return this.authStatusListener.asObservable();
    }

    getOrders(){
        const email = localStorage.getItem('email');
        console.log(email);
        return this.http.get<Order[]>(`http://localhost:3000/view-orders/${email}`)
        
    }

    deleteOrders(orderId:string){
        return this.http.delete(`http://localhost:3000/remove/${orderId}`)
    }

    addUsers(user: User){

        this.http.post<{message: string, token: string[]}>('http://localhost:3000/signup', user)
        .subscribe((response)=>{
            // console.log(response)
            this.users.push(user);
            this.router.navigate(['/login'])
        })
    }

    updateUser(body:any) {
        const id = localStorage.getItem('userId')
        return this.http.patch(`http://localhost:3000/update/${id}`,body)
    }

    login(user:any){
        this.http.post<{message: string, token:string, userId:string}>('http://localhost:3000/login',user)
        .subscribe((response)=>{
            const token = response.token
            const userId = response.userId
            this.token = token;
            if(token){
                this.isAuth = true;
                this.authStatusListener.next(true);
                console.log(response);
                this.saveAuthData(token, user.email, userId)
                console.log({
                    token: token,
                    email: user.email
                })
                this.router.navigate(['/'])
            }
        })
    }

    logout(){
        this.token = '';
        this.isAuth = false;
        this.authStatusListener.next(false);
        this.removeAuthData();
        this.router.navigate(['/login'])
    }

    private saveAuthData(token: string, email: string, userId: string){
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('userId', userId);
    }

    private removeAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
    }

    getAuthData(){
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if(!token || !email){
            return
        }
        return {
            token: token,
            email: email
        }
    }

    sendOrders(productName:string){
        this.data = {
            email: this.getAuthData()?.email,
            productName: productName
        }
        console.log(this.data)
        this.http.post('http://localhost:3000/order',this.data)
            .subscribe(response =>{
                console.log(response)
            })
    }

}