import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { TransactionService } from '../transaction.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.css'
})
export class CreditComponent {

  creditForm: FormGroup;
  currentUser: any = null;  // Store the logged-in user

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private transactionService: TransactionService,
    private router: Router
  ) {
    // Retrieve the logged-in user from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    
    // Initialize the form, setting the account number to the logged-in user's account and disabling it
    this.creditForm = this.fb.group({
      accountNumber: [{ value: this.currentUser?.accountNumber, disabled: true }],  // Disable the field
      creditAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

//   onSubmit() {
//     // Use the logged-in user's account number directly
//     const accountNumber = this.currentUser.accountNumber;
//     const creditAmount = this.creditForm.value.creditAmount;

//     // Fetch the user by account number and update balance
//     this.authService.getUserByAccountNumber(accountNumber).subscribe(user => {
//       if (user) {
//         const updatedBalance = user.balance + creditAmount;
//         const updatedUser = { ...user, balance: updatedBalance };

//         // Update the user account in the backend
//         this.authService.updateUser(user.id, updatedUser).subscribe(() => {
//           alert(`${creditAmount} credited successfully!`);

//           // Update the logged-in user's balance in localStorage
//           this.authService.updateLocalStorageUser(updatedUser);

//           // Navigate to the dashboard to reflect the updated balance
//           this.router.navigate(['/dashboard/dashboard']);
//         });
//       } else {
//         alert('Account not found.');
//       }
//     });
//   }
// }
onSubmit() {
  const accountNumber = this.currentUser.accountNumber;
  const creditAmount = this.creditForm.value.creditAmount;

  // Fetch the user by account number (not necessarily the logged-in user)
  this.authService.getUserByAccountNumber(accountNumber).subscribe(user => {
    if (user) {
      const updatedBalance = user.balance + creditAmount;
      const updatedUser = { ...user, balance: updatedBalance };

      // Update the specific user account in the backend
      this.authService.updateUser(user.id, updatedUser).subscribe(() => {
        alert(`${creditAmount} : Amount credited successfully!`);
        const transaction = {
          accountNumber: user.accountNumber,
          type: 'Credit',
          amount: creditAmount,
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

        // Reload the dashboard to reflect the updated balance if applicable
        this.router.navigate(['/dashboard/dashboard']);
      });
    });
  } else {
    alert('Account not found.');
  }
});
}
}