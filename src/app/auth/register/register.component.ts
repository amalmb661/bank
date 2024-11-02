import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  accountNumberExists: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.registerForm = this.fb.group({
      accountNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      balance:0
    });
  }

  onSubmit() {
    const accountNumber = this.registerForm.value.accountNumber;

    
    this.authService.checkAccountNumberUnique(accountNumber).subscribe(users => {
      if (users.length > 0) {
        this.accountNumberExists = true;
      } else {
        this.authService.register(this.registerForm.value).subscribe(response => {  // Account number unique anonn nokan
          console.log('User registered successfully', response);
          alert("successfully registered")
          this.router.navigate(['/auth/login']);
        });
      }
    });
  }
}
