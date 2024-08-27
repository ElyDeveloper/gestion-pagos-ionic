import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import {FileUploader, FileUploaderOptions } from "ng2-file-upload";
import { environment } from "src/environments/environment";
const apiUrl = environment.apiURL + "upload-file/";

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.component.html",
  styleUrl: "./uploader.component.scss",
})
export class UploaderComponent {
  @(Output()!) uploaderChange = new EventEmitter<FileUploader>();
  @ViewChild("fileInputTemplate")
  fileInputTemplate!: ElementRef<HTMLInputElement>;

  uploader: FileUploader;

  hasAnotherDropZoneOver: boolean;

  isInvalid: boolean = false;

  constructor() {
    const uploaderOptions: FileUploaderOptions = {
      url: apiUrl + "pago",
      itemAlias: "file",
      queueLimit: 1,
      allowedMimeType: [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp", // Imágenes comunes
        "application/pdf", // PDF
      ],
      allowedFileType: ["image", "pdf"],
      maxFileSize: 10 * 1024 * 1024, // 10 MB límite de tamaño (opcional)
    };

    this.uploader = new FileUploader(uploaderOptions);
    this.hasAnotherDropZoneOver = false;
  }

  selectFile() {
    this.uploader.clearQueue();

    this.fileInputTemplate.nativeElement.click();
  }

  onSelect() {
    this.uploaderChange.emit(this.uploader);
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}
