import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
    selector: 'app-create-user',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-user.html',
    styleUrl: './create-user.css'
})
export class CreateUserComponent {
    username = '';
    password = '';
    role = 'user';
    selectedFile: File | null = null;
    message = '';
    @Output() userCreated = new EventEmitter<void>();

    constructor(private userService: UserService) { }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    onSubmit() {
        const formData = new FormData();
        formData.append('username', this.username);
        formData.append('password', this.password);
        formData.append('role', this.role);
        if (this.selectedFile) {
            formData.append('profile_photo', this.selectedFile);
        }

        this.userService.createUser(formData).subscribe({
            next: () => {
                this.message = 'User created successfully.';
                this.username = '';
                this.password = '';
                this.selectedFile = null;
                this.userCreated.emit();
            },
            error: (err) => {
                this.message = 'Error creating user: ' + (err.error?.message || err.message);
            }
        });
    }
}
