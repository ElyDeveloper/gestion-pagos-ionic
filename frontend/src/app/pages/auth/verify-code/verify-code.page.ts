import { Component, inject, OnInit } from "@angular/core";
import { firstValueFrom, interval, Subscription, takeWhile } from "rxjs";
import { NgxOtpInputComponentOptions } from "ngx-otp-input";
import { GlobalService } from "src/app/shared/services/global.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-verify-code",
  templateUrl: "./verify-code.page.html",
  styleUrls: ["./verify-code.page.scss"],
})
export class VerifyCodePage implements OnInit {
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 6,
    autoFocus: true,
    autoBlur: false,
    hideInputValues: false,
    regexp: new RegExp("^[A-Z0-9]+$"),
    showBlinkingCursor: true,
    ariaLabels: [
      "Primer elemento",
      "Segundo elemento",
      "Tercer elemento",
      "Cuarto elemento",
      "Quinto elemento",
      "Sexto elemento",
    ],
    inputMode: "numeric",
  };

  remainingTime: string = "0:00";

  isToastOpen: boolean = false;
  toastMessage: string = "";

  private countdownSubscription!: Subscription;
  private _globalService = inject(GlobalService);
  private router = inject(Router);
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    //Tomar el expiracion-code de la cookie
    const expirationCode = localStorage.getItem("expiration-code");
    if (!expirationCode) {
      this.router.navigate(["forgot-password"]);
    } else {
      const expirationDate = new Date(expirationCode);
      if (expirationDate.getTime() < new Date().getTime()) {
        this.router.navigate(["forgot-password"]);
      } else {
        //Mostrar el tiempo restante
        const durationInSeconds = Math.floor(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        );

        this.startCountdown(durationInSeconds);
      }
    }

    //Verificar si el tiempo de expiracion ha pasado
  }

  ionViewDidLeave() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      //console.log("Unsubscribed from countdown");
    }
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  submitForm(event: any): void {
    firstValueFrom(
      this._globalService.Post("verify-code", { code: event })
    ).then((result: any) => {
      if (result.error) {
        this.toastMessage = result.error;
        this.isToastOpen = true;
      } else {
        this.router.navigate(["reset-password", result.userId]);
      }
    }).catch(error => {
      console.error("Error verifying code: ", error);
      this.toastMessage = "Error verificando el código";
      this.isToastOpen = true;
    });
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
        this.toastMessage = "El tiempo de verificación ha expirado";
        this.isToastOpen = true;
        setTimeout(() => {
          this.router.navigate(["forgot-password"]);
        }, 3000);
      }
    });
  }
}
