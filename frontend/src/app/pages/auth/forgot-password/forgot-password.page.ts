import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom, interval, Subscription, takeWhile } from "rxjs";
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
  isCodeActive: boolean = false;

  remainingTime: string = "0:00";
  toastMessage: string = "";
  textLoader: string = "Procesando";

  private countdownSubscription!: Subscription;

  private _globalService = inject(GlobalService);

  private router = inject(Router);
  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      identificator: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    //Tomar el expiracion-code de la cookie
    const expirationCode = localStorage.getItem("expiration-code");

    if (expirationCode) {
      this.isCodeActive = false;

      //Verificar si el tiempo de expiracion ha pasado
      const expirationDate = new Date(expirationCode);
      if (expirationDate.getTime() < new Date().getTime()) {
        this.isCodeActive = false;
      } else {
        this.isCodeActive = true;
        //Mostrar el tiempo restante
        const durationInSeconds = Math.floor(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        );

        this.startCountdown(durationInSeconds);
      }
      return;
    }
  }

  ionViewDidLeave() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      //console.log("Unsubscribed from countdown");
    }
  }

  private startCountdown(durationInSeconds: number) {
    const endTime = new Date().getTime() + durationInSeconds * 1000;
  
    firstValueFrom(
      interval(1000).pipe(
        takeWhile(() => new Date().getTime() < endTime)
      )
    ).then(() => {
      const remaining = endTime - new Date().getTime();
      const minutes = Math.floor(
        (remaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      this.remainingTime = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
  
      if (this.remainingTime == "0:00") {
        this.toastMessage =
          "El tiempo de verificación ha expirado, solicite un nuevo código.";
        this.isToastOpen = true;
        this.isCodeActive = false;
      }
    });
  }

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
  
      firstValueFrom(
        this._globalService.Post("send-email", {
          identificator: this.validateForm.value.identificator,
          option: 1,
        })
      ).then((result: any) => {
        if (result.error) {
          this.toastMessage = result.error;
          this.isToastOpen = true;
          this.loaderComponent.hide();
        } else {
          localStorage.setItem("expiration-code", result.expiration);
          this.router.navigate(["/verify-code"]);
        }
        this.loaderComponent.hide();
      }).catch(error => {
        this.toastMessage = "Ha ocurrido un error, por favor intente de nuevo.";
        this.isToastOpen = true;
        this.loaderComponent.hide();
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
