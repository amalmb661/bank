import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';  // Import paginator classes

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit, AfterViewInit {

  transactions: any[] = [];   // Store the user's transaction history
  currentUser: any;           // Store logged-in user's data
  paginatedTransactions: any[] = [];  // Transactions to display based on pagination
  pageNumber:number = 1;
  itemsPerPage:number = 10;
  totalPage:number = 0;
  pageNumberArray:number[] = []
  gotoPageNumber: number = 1;
  // Pagination variables
  pageSize: number = 10;
  pageIndex: number = 0;
  totalTransactions: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,  
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserTransactions();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedTransactions();
    });
  }

  loadUserTransactions(): void {
    // Retrieve the logged-in user's account number
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    const accountNumber = this.currentUser.accountNumber;

    // Fetch all transactions and filter by the logged-in user's account number
    this.transactionService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data.filter(transaction => transaction.accountNumber === accountNumber);

      // Set total transactions count for pagination
      this.totalTransactions = this.transactions.length;

      // Initialize the paginated transactions
      this.updatePaginatedTransactions();
    });
  }

  // Handle pagination
  updatePaginatedTransactions(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTransactions = this.transactions.slice(start, end);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']); // Redirect to login page
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe(() => {
      alert('Transaction deleted successfully!');
      this.loadUserTransactions();  // Reload transactions after deletion
    });
  }

}






// export class TransactionHistoryComponent {
//   transactions: any[] = [];
//   currentPage = 1;
//   pageSize = 5;

//   constructor(private transactionService: TransactionService) {}

//   ngOnInit(): void {
//     this.transactionService.getTransactions().subscribe((data) => {
//       this.transactions = data;
//     });
   
  
//   }

//   // Pagination logic
//   get paginatedTransactions() {
//     const startIndex = (this.currentPage - 1) * this.pageSize;
//     const endIndex = startIndex + this.pageSize;
//     return this.transactions.slice(startIndex, endIndex);
//   }

//   nextPage() {
//     this.currentPage++;
//   }

//   previousPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }
// }