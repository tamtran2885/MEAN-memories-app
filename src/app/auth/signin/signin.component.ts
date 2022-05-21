import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  isLoading: boolean = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignIn(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.signin(form.value.email, form.value.password);
  }


}
