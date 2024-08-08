import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { interval, Subscription, takeWhile } from "rxjs";
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

  remainingTime: string = "";

  isToastOpen: boolean = false;
  toastMessage: string = "";

  private countdownSubscription!: Subscription;
  private _globalService = inject(GlobalService);
  private router = inject(Router);
  constructor() {}

  ngOnInit() {
    this.startCountdown(5 * 60); // 5 minutes countdown
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  submitForm(event: any): void {
    console.log("Form submitted", event);
    // Implement your code verification logic here
    this._globalService
      .Post("verify-code", { code: event })
      .subscribe((result: any) => {
        if (result.error) {
          this.toastMessage = result.error;
          this.isToastOpen = true;
        } else {
          this.router.navigate(["reset-password", result]);
        }
      });
  }

  private startCountdown(durationInSeconds: number) {
    const endTime = new Date().getTime() + durationInSeconds * 1000;

    this.countdownSubscription = interval(1000)
      .pipe(takeWhile(() => new Date().getTime() < endTime))
      .subscribe(() => {
        const remaining = endTime - new Date().getTime();
        const minutes = Math.floor(
          (remaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        this.remainingTime = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
      });
  }
}
