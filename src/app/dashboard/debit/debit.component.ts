import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { TransactionService } from '../transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debit',
  templateUrl: './debit.component.html',
  styleUrl: './debit.component.css'
})
export class DebitComponent {

  debitForm: FormGroup;
  currentUser: any = null;  // Store the logged-in user
  // constructor(private fb: FormBuilder, private authService: AuthService, private transactionService: TransactionService,private router: Router) {
  //   this.debitForm = this.fb.group({
  //     accountNumber: ['', [Validators.required]],
  //     debitAmount: ['', [Validators.required, Validators.min(1)]]
  //   });
  // }
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private transactionService: TransactionService,
    private router: Router
  )
  {
    // Retrieve the logged-in user from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    
    // Initialize the form, setting the account number to the logged-in user's account and disabling it
    this.debitForm = this.fb.group({
      accountNumber: [{ value: this.currentUser?.accountNumber, disabled: true }],  // Disable the field
      debitAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }
  // ngOnInit(): void {
  //   // Get the current user from localStorage
  //   const userData = localStorage.getItem('currentUser');
  //   if (userData) {
  //     this.currentUser = JSON.parse(userData);
  //     // Set the account number to the logged-in user's account number
  //     this.debitForm.patchValue({ accountNumber: this.currentUser.accountNumber });
  //   }
  // }


  onSubmit() {
    const accountNumber = this.currentUser.accountNumber;
    const debitAmount = this.debitForm.value.debitAmount;
  
    this.authService.getUserByAccountNumber(accountNumber).subscribe(user => {
      if (user) {
        if (user.balance >= debitAmount) {
          const updatedBalance = user.balance - debitAmount;
          const updatedUser = { ...user, balance: updatedBalance };
  
          this.authService.updateUser(user.id, updatedUser).subscribe(() => {
            alert(`${debitAmount} Amount debited successfully!`);
            const transaction = {
              accountNumber: user.accountNumber,
              type: 'Debit',
              amount: debitAmount,
              date: new Date().toISOString()
            };
    
            // Record the transaction
            this.transactionService.recordTransaction(transaction).subscribe(() => {
            // Check if the credited account is the logged-in user's account
        const loggedInUser = JSON.parse(localStorage.getItem('currentUser')!);
        if (loggedInUser && loggedInUser.accountNumber === accountNumber) {
          this.authService.updateLocalStorageUser(updatedUser);
          // Update the logged-in user's balance in localStorage
          const updatedLoggedInUser = { ...loggedInUser, balance: updatedBalance };
          this.authService.updateLocalStorageUser(updatedLoggedInUser);
        }

            // Reload dashboard after updating
            this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/dashboard/dashboard']);
            });
          });
        });
        } else {
          alert('Insufficient balance.');
        }
      } else {
        alert('Account not found.');
      }
    });
  }
  
}  