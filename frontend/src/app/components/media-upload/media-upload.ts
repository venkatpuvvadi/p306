import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../services/media';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-upload.html',
  styleUrl: './media-upload.css'
})
export class MediaUploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  message = '';
  @Output() uploadSuccess = new EventEmitter<void>();

  constructor(private mediaService: MediaService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.message = '';

    this.mediaService.uploadMedia(this.selectedFile).subscribe({
      next: (event: any) => {
        this.message = 'Upload successful!';
        this.uploading = false;
        this.selectedFile = null;
        this.uploadSuccess.emit();
      },
      error: (err: any) => {
        this.message = 'Upload failed: ' + (err.error?.message || err.message);
        this.uploading = false;
      }
    });
  }
}
