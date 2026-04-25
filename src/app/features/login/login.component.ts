import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.api.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        localStorage.setItem('token', res);

        // 👇 ensure fresh load
        this.router.navigate(['/home']);

      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }
}