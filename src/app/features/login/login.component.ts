import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  selectedUser: 'A' | 'B' = 'B';  // 👈 default B
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  selectUser(user: 'A' | 'B') {
    this.selectedUser = user;
  }

  login() {

    const email =
      this.selectedUser === 'A'
        ? 'a@mail.com'
        : 'b@mail.com';

    this.api.login({
      email,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        localStorage.setItem('token', res);

        this.router.navigate(['/home']);

      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }
}