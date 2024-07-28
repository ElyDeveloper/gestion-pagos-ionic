import { Component, inject, Input, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
})
export class LoaderComponent implements OnInit {
  @Input() textLoader: string = "Cargando";

  private spinner = inject(NgxSpinnerService);
  constructor() {}

  ngOnInit() {}

  show() {
    this.spinner.show();
  }

  hide() {
    this.spinner.hide();
  }
}
