import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreditComponent } from './credit/credit.component';
import { DebitComponent } from './debit/debit.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent,canActivate:[authGuard] },
  { path: 'credit', component: CreditComponent,canActivate:[authGuard] },
  { path: 'debit', component: DebitComponent,canActivate:[authGuard] },
  { path: 'transactions', component: TransactionHistoryComponent,canActivate:[authGuard] }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
