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
        console.log("TOKEN:", res);

        localStorage.setItem('token', res);

        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error("LOGIN ERROR:", err); // 👈 SEE REAL ERROR
        this.error = 'Invalid credentials';
      }
    });
  }
}