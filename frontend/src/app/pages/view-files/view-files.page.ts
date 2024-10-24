import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpResponse } from "@capacitor/core";
import { firstValueFrom } from "rxjs";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-view-files",
  templateUrl: "./view-files.page.html",
  styleUrls: ["./view-files.page.scss"],
})
export class ViewFilesPage implements OnInit {
  @ViewChild("imageElement") imageElement!: ElementRef;

  isImage: boolean = false;
  isPdf: boolean = false;
  fileUrl: SafeUrl | string = "";
  error: string | null = null;
  scale: number = 1;
  rotation: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getFile();
  }

  goBack() {
    this.router.navigate(["/layout/pagos"]);
  }

  getFile() {
    firstValueFrom(this.route.paramMap).then((params) => {
      const id = params.get("id");
      if (id) {
        firstValueFrom(this.globalService.GetIdDecrypted("decrypted-id", id))
          .then((decryptedId: any) => {
            firstValueFrom(
              this.globalService.downloadFile("getFile", decryptedId)
            )
              .then((response: any) => {
                const blob = response.body;
                if (blob) {
                  const contentType =
                    response.headers.get("Content-Type") || "";
                  this.isImage = contentType.startsWith("image/");
                  this.isPdf = contentType === "application/pdf";

                  if (this.isImage || this.isPdf) {
                    const unsafeUrl = URL.createObjectURL(blob);
                    //console.log("unsafeUrl: ", unsafeUrl);

                    this.fileUrl = unsafeUrl;
                  } else {
                    this.error = "Unsupported file type";
                  }
                }
              })
              .catch((error) => {
                console.error("Error downloading file: ", error);
                this.error = "Error downloading file";
              });
          })
          .catch((error) => {
            console.error("Error decrypting ID: ", error);
            this.error = "Error decrypting ID";
          });
      } else {
        this.router.navigate(["/layout/home"]);
      }
    });
  }

  zoomIn() {
    this.scale *= 1.2;
  }

  zoomOut() {
    this.scale /= 1.2;
  }

  rotateClockwise() {
    this.rotation += 90;
  }

  rotateCounterClockwise() {
    this.rotation -= 90;
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
  }

  onImageLoad() {
    // You can add any logic here that needs to run after the image loads
    //console.log("Image loaded");
  }
}
