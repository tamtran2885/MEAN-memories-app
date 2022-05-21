import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';

import { User } from "./user.model";
import { Router } from '@angular/router';

@Injectable({providedIn: "root"})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Extract token received from server
  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const userData: User = {
      email: email,
      password: password
    };
    this.http.post("http://localhost:3000/api/users/signup", userData)
      .subscribe(response => {
        console.log(response)
      })
  }

  signin(email: string, password: string) {
    const userData: User = {
      email: email,
      password: password
    };
    this.http.post<{ token: string }>("http://localhost:3000/api/users/signin", userData)
      .subscribe(response => {
        // console.log(response);
        const fetchedToken = response.token;
        this.token = fetchedToken;
        if (fetchedToken) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(["/"]);
        }
      })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
  }

}
