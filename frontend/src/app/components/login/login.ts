import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (user) => {
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password';
        console.error(err);
      }
    });
  }
}
