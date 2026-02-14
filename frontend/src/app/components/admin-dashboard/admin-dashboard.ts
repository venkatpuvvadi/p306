import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';
import { CreateUserComponent } from '../create-user/create-user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CreateUserComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService, private router: Router, private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error(err)
    });
  }

  onUserCreated() {
    this.loadUsers();
  }

  viewUser(id: number) {
    this.router.navigate(['/admin/user', id]);
  }

  editUser(id: number) {
    this.router.navigate(['/admin/user/edit', id]);
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to change this user status?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
