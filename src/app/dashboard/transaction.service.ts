import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionApiUrl = 'http://localhost:3000/transactions'; 
  constructor(private http: HttpClient) {}

  
  recordTransaction(transaction: any): Observable<any> {
    return this.http.post(this.transactionApiUrl, transaction);
  }

  
  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(this.transactionApiUrl);
  }
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.transactionApiUrl}/${id}`);
  }

}