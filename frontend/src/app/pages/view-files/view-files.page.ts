import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-view-files",
  templateUrl: "./view-files.page.html",
  styleUrls: ["./view-files.page.scss"],
})
export class ViewFilesPage implements OnInit {
  isImage: boolean = false;
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  constructor() {}

  ngOnInit() {
    this.getFile();
  }

  getFile() {
    this._route.paramMap.subscribe((params) => {
      const url = params.get("url");
      console.log("URL: ", url);
      if (url) {
        const ext = url.substring(url.lastIndexOf(".") + 1);
        if (ext === "jpg" || ext === "png" || ext === "gif") {
          console.log("Abrir imagen en modal");
          this.isImage = true;
        } else if (ext === "pdf") {
          console.log("Abrir pdf en pdf viewer");
          this.isImage = false;
        }
      } else {
        //redirigir a home
        this._router.navigate(["/layout/home"]);
      }
    });
  }
}
