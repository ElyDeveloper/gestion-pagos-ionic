import { Component, inject, Input, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-loader",
  template: `
    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="medium"
      color="#fff"
      type="ball-fussion"
      [fullScreen]="true"
      ><ion-label style="color: white"
        >{{ textLoader }}...</ion-label
      ></ngx-spinner
    >
  `,
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
