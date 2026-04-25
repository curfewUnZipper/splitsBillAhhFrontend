import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { GroupCardComponent } from './features/group-card/group-card.component';
import { AddExpenseComponent } from './features/add-expense/add-expense.component';
import { LoginComponent } from './features/login/login.component';

import { AppRoutingModule } from './app-routing.module';

// ✅ NEW WAY
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GroupCardComponent,
    AddExpenseComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))  // ✅ correct
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}