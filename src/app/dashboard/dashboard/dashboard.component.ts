import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  currentUser: any = null;

  
  ngOnInit(): void {
    
    const userData = localStorage.getItem('currentUser');
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    if (userData) {
      this.currentUser = JSON.parse(userData);
      
    }
  }

  constructor(private authService: AuthService, private router: Router) {
    
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}




