import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Product} from "./post.model"

@Injectable({providedIn: 'root'})
export class PostsService{
    
    public post: Product[] = [];
    
    constructor(private http: HttpClient) {}

    getProducts(){
        return this.http.get<Product[]>('http://localhost:3000/products')        
    }


}