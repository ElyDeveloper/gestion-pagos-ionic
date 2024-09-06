// loader.component.ts
import { Component, Input, OnInit, OnDestroy, inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: "app-loader",
  template: `
    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="medium"
      color="#fff"
      type="ball-fussion"
      [fullScreen]="true">
      <ion-label style="color: white">{{ textLoader }}...</ion-label>
    </ngx-spinner>
  `,
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Input() textLoader: string = "Cargando";

  private subscription: Subscription;

  private spinner = inject(NgxSpinnerService);
  private loaderService = inject(LoaderService);
  constructor() {
    this.subscription = this.loaderService.loaderAction$.subscribe(
      (action: any) => {
        if (action === "show") {
          this.show();
        } else if (action === "hide") {
          this.hide();
        }
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  show() {
    this.spinner.show();
  }

  hide() {
    this.spinner.hide();
  }
}
