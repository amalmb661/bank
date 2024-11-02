import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/users'; 


  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

 
  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  
  updateLocalStorageUser(updatedUser: any): void {
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }
  

  // Register new user
  register(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  // Login user
  login(accountNumber: string, password: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?accountNumber=${accountNumber}`).pipe(
      map(users => {
        
        const user = users.find(u => u.password === password);
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          return [user];  
        } else {
          return [];  
        }
      })
    );
  }
  
  
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  }

  
  // Check if account number is unique
  checkAccountNumberUnique(accountNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?accountNumber=${accountNumber}`);
  }




  getUserByAccountNumber(accountNumber: string): Observable<any | null> {
    return this.http.get<any[]>(`${this.apiUrl}?accountNumber=${accountNumber}`).pipe(
      map(users => users.length > 0 ? users[0] : null)  
    );
  }

// Update user balance
updateUser(id: number, updatedUser: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, updatedUser);
}
}
