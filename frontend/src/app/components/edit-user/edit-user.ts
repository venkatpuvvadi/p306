import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-user.html',
    styleUrl: './edit-user.css'
})
export class EditUserComponent implements OnInit {
    user: any = { username: '', role: 'user', is_active: true };
    password = '';
    userId: number = 0;
    message = '';

    selectedFile: File | null = null;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadUser();
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    loadUser() {
        this.userService.getUserById(this.userId).subscribe({
            next: (data) => {
                this.user = data;
                // SQLite boolean might come as 0 or 1
                this.user.is_active = !!this.user.is_active;
            },
            error: (err) => console.error(err)
        });
    }

    onSubmit() {
        const formData = new FormData();
        formData.append('username', this.user.username);
        formData.append('role', this.user.role);
        formData.append('is_active', this.user.is_active);

        if (this.password) {
            formData.append('password', this.password);
        }

        if (this.selectedFile) {
            formData.append('profile_photo', this.selectedFile);
        }

        this.userService.updateUser(this.userId, formData).subscribe({
            next: () => {
                this.message = 'User updated successfully.';
                setTimeout(() => this.router.navigate(['/admin']), 1500);
            },
            error: (err) => {
                this.message = 'Error updating user: ' + (err.error?.message || err.message);
            }
        });
    }
}
