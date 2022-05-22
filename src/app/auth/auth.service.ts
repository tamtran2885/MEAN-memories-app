import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';

import { User } from "./user.model";
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({providedIn: "root"})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private tokenTimer: any;
  private userId: string;

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

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const userData: User = {
      email: email,
      password: password
    };
    return this.http.post(BACKEND_URL + "/signup", userData)
      .subscribe(() => {
        this.router.navigate(["/"]);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  signin(email: string, password: string) {
    const userData: User = {
      email: email,
      password: password
    };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + "/signin", userData)
      .subscribe(response => {
        // console.log(response);
        const fetchedToken = response.token;
        this.token = fetchedToken;
        if (fetchedToken) {
          const expiresInDuration = response.expiresIn;
          // console.log(response.expiresIn)

          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);

          // Save token in local storage and redirect to home page
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(fetchedToken, expirationDate, this.userId);
          this.router.navigate(["/"]);
        }
      }, error => {
        this.authStatusListener.next(false);
      })
  }

  // auto check authentication when app initializes
  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;

      this.setAuthTimer(expiresIn / 1000),
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;

    // Clear token from local storage
    this.clearAuthData();

    // Redirect to home page
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // Save token in local storage
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  // clear token from local storage
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  // get token data from local storage
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
