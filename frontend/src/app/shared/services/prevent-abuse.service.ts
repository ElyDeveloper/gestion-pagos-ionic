import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { Subject, throttleTime } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PreventAbuseService {
  private clickSubject = new Subject<void>();
  private lastClickTime = 0;

  constructor(private toastController: ToastController) {
    this.clickSubject
      .pipe(
        throttleTime(1500) // Previene clics múltiples dentro de 2 segundos
      )
      .subscribe(() => {
        // La lógica aquí se ejecutará como máximo una vez cada 2 segundos
      });
  }

  async registerClick(): Promise<boolean> {
    //console.log("Se hizo click");
    const currentTime = Date.now();
    if (currentTime - this.lastClickTime < 1500) {
      await this.showAbuseTost();
      return false;
    }
    this.lastClickTime = currentTime;
    this.clickSubject.next();
    return true;
  }

  private async showAbuseTost() {
    const toast = await this.toastController.create({
      message: "Por favor, no hagas clic tan rápido.",
      duration: 2000,
      position: "bottom",
      color: "warning",
    });
    toast.present();
  }
}
