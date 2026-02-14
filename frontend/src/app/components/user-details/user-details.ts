import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from '../../services/media';
import { UserService } from '../../services/user';

@Component({
    selector: 'app-user-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-details.html',
    styleUrl: './user-details.css'
})
export class UserDetailsComponent implements OnInit {
    user: any = null;
    mediaFiles: any[] = [];
    userId: number = 0;

    constructor(
        private route: ActivatedRoute,
        private mediaService: MediaService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadUser();
        this.loadMedia();
    }

    loadUser() {
        this.userService.getUserById(this.userId).subscribe({
            next: (data) => this.user = data,
            error: (err) => console.error(err)
        });
    }

    loadMedia() {
        this.mediaService.getUserMedia(this.userId).subscribe({
            next: (data) => this.mediaFiles = data,
            error: (err) => console.error(err)
        });
    }

    deleteMedia(id: number) {
        if (confirm('Are you sure you want to delete this file?')) {
            this.mediaService.deleteMedia(id).subscribe({
                next: () => this.loadMedia(),
                error: (err) => alert('Failed to delete media: ' + err.message)
            });
        }
    }
}
