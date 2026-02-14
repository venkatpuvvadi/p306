import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../services/media';
import { MediaUploadComponent } from '../media-upload/media-upload';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, MediaUploadComponent],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboardComponent implements OnInit {
  mediaFiles: any[] = [];
  selectedFile: File | null = null; // Added for upload functionality
  uploading: boolean = false; // Added for upload functionality

  constructor(private mediaService: MediaService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia() {
    this.mediaService.getMyMedia().subscribe({
      next: (data) => this.mediaFiles = data,
      error: (err) => console.error(err)
    });
  }

  onUploadSuccess() {
    this.loadMedia();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.mediaService.uploadMedia(this.selectedFile).subscribe({
      next: () => {
        this.uploading = false;
        this.selectedFile = null;
        this.loadMedia();
      },
      error: (err) => {
        this.uploading = false;
        console.error(err);
        alert('Upload failed: ' + err.message);
      }
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

  logout() {
    this.authService.logout();
  }
}

