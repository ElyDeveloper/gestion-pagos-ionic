import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage implements OnInit {
  validateForm!: FormGroup;
  isToastOpen: boolean = false;
  toastMessage: string = "";
  private _globalService = inject(GlobalService);
  private router = inject(Router);
  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      identificator: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this._globalService
        .Post("send-email", {
          identificator: this.validateForm.value.identificator,
          // subject: 'Codigo de verificación',
          // text: 'Su codigo de verificacion es : ',
          option: 1,
        })
        .subscribe((result: any) => {
          if (result.error) {
            //Mostrar toast
            this.toastMessage = result.error;
            this.isToastOpen = true;
          } else {
            //Mostrar toast
            this.toastMessage =
              "Se ha enviado un correo a su dirección de correo electrónico";
            this.router.navigate(["/verify-code"]);
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
