import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
import { environment } from "src/environments/environment";

const apiUrl = environment.apiURL + "upload-file/";

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.component.html",
  styleUrls: ["./uploader.component.scss"],
})
export class UploaderComponent {
  @Output() uploaderChange = new EventEmitter<FileUploader>();
  @Output() fileSelected = new EventEmitter<File>();
  @ViewChild("fileInputTemplate")
  fileInputTemplate!: ElementRef<HTMLInputElement>;

  uploader: FileUploader;
  hasAnotherDropZoneOver: boolean = false;
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
        "image/webp",
        "application/pdf",
      ],
      allowedFileType: ["image", "pdf"],
      maxFileSize: 10 * 1024 * 1024, // 10 MB límite de tamaño
    };

    this.uploader = new FileUploader(uploaderOptions);
    this.uploader.onAfterAddingFile = (fileItem) => {
      this.uploaderChange.emit(this.uploader);
      if (fileItem._file) {
        this.fileSelected.emit(fileItem._file);
      }
    };
    this.uploader.onWhenAddingFileFailed = (item, filter) => {
      this.isInvalid = true;
      // Aquí puedes manejar el caso de archivo inválido, por ejemplo, mostrando un mensaje de error
    };
  }

  selectFile() {
    this.uploader.clearQueue();
    this.fileInputTemplate.nativeElement.click();
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  removeFile(item: any) {
    item.remove();
    this.uploaderChange.emit(this.uploader);
    this.fileSelected.emit(undefined);
  }
}