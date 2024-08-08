import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { key } from "src/app/libraries/key.library";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;

  validateForm!: FormGroup;
  isToastOpen: boolean = false;
  toastMessage: string = "";
  textLoader: string = "Procesando";
  private _globalService = inject(GlobalService);
  _cookieService = inject(CookieService);

  private router = inject(Router);
  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      identificator: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  verifyKey(event: any) {
    if (event.key === "Enter") {
      this.submitForm();
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.textLoader = "Generando código, por favor espere";
      this.loaderComponent.show();
      this._globalService
        .Post("send-email", {
          identificator: this.validateForm.value.identificator,
          // subject: 'Codigo de verificación',
          // text: 'Su codigo de verificacion es : ',
          option: 1,
        })
        .subscribe((result: any) => {
          console.log(result);
          if (result.error) {
            //Mostrar toast
            this.toastMessage = result.error;
            this.isToastOpen = true;
            this.loaderComponent.hide();
          } else {
            //Setear la expiracion del token en cookies
            this._cookieService.set(
              "expiration-code",
              result.expiration,
              key.CODE_VERIFICATION_EXPIRATION_TIME,
              ""
            );
            this.loaderComponent.hide();
            this.router.navigate(["/verify-code"]);
            // this.router.navigate(["/verify-code"]);
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.toastMessage = "Por favor, coloque un correo válido.";
      this.isToastOpen = true;
    }
  }
}
