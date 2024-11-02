import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  loginFailed: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      accountNumber: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  onSubmit() {
    const { accountNumber, password } = this.loginForm.value;
    this.authService.login(accountNumber, password).subscribe(users => {
      if (users.length > 0) {
        console.log('Login successful', users[0]);
        const userToStore = {
          accountNumber:users[0].accountNumber,
          name: users[0].name,
          balance: users[0].balance
          
        };
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        this.router.navigate(['/dashboard/dashboard']);  
      } else {
        this.loginFailed = true;
      }
    }, error => {
      console.error('Login error:', error);
      this.loginFailed = true;
    });
  }
}  