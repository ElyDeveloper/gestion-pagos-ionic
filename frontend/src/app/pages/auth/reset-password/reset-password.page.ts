import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { firstValueFrom } from "rxjs";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.page.html",
  styleUrls: ["./reset-password.page.scss"],
})
export class ResetPasswordPage implements OnInit {
  validateForm!: FormGroup;
  userId: string = "";

  isToastOpen: boolean = false;
  toastMessage: string = "";

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private _globalService = inject(GlobalService);
  private _alertController = inject(AlertController);

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      identificator: ["", [Validators.required, Validators.email]],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    firstValueFrom(
      this.route.paramMap
    ).then((params) => {
      const id = params.get("id");
      if (id !== null) {
        this.userId = id;
        this.consultarCredenciales(id);
      }
    });
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  consultarCredenciales(id: string): void {
    firstValueFrom(
      this._globalService.Get("credenciales/" + id)
    ).then((response: any) => {
      if (response.error) {
        this.toastMessage = response.error;
        this.isToastOpen = true;
      } else {
        this.validateForm.get("identificator")?.setValue(response.correo);
      }
    }).catch(error => {
      console.error("There was an error!", error.error.error.message);
      this.toastMessage = "Ha ocurrido un error, " + error.error.error.message;
      this.isToastOpen = true;
  
      //esperar 2 segundos y redirigir
      setTimeout(() => {
        this.router.navigate(["/forgot-password"]);
      }, 2000);
    });
  }

  resetPassword() {
    if (this.validateForm.valid) {
      firstValueFrom(
        this._globalService.Post("reset-password", this.validateForm.value)
      ).then((response: any) => {
        if (response.error) {
          this.toastMessage = response.error;
          this.isToastOpen = true;
        } else {
          this.toastMessage = response.message;
          this.isToastOpen = true;
          this.questRedirect();
        }
      }).catch(error => {
        console.error("There was an error!", error);
        this.toastMessage = "Ha ocurrido un error";
        this.isToastOpen = true;
      });
    }
  }

  async questRedirect() {
    const alert = await this._alertController.create({
      header: "Se cambio la contraseña",
      message: "¿Desea ir a inicio de sesión?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            //console.log("Redirección cancelada");
          },
        },
        {
          text: "Si",
          handler: () => {
            this.router.navigate(["/login"]);
          },
        },
      ],
    });

    await alert.present();
  }

  goBackToLogin() {
    this.router.navigate(["/login"]);
  }
}
