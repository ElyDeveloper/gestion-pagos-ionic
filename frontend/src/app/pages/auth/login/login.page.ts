import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SplashScreen } from "@capacitor/splash-screen";
import { ValidatorFn, AbstractControl } from "@angular/forms";
import { GlobalService } from "src/app/shared/services/global.service";
import { key } from "src/app/libraries/key.library";
import { AuthService } from "src/app/shared/services/auth.service";
import { AlertController } from "@ionic/angular";
import { firstValueFrom, Subscription } from "rxjs";
import { LoaderService } from "src/app/shared/services/loader.service";

interface Login {
  identificator: string;
  password: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  user: Login = {
    identificator: "",
    password: "",
  };

  textLoader: string = "Cargando";
  isToastOpen: boolean = false;
  toastMessage: string = "";
  toastColor: string = "primary";
  formErrors: any = {
    email: "",
    password: "",
  };


  private _router = inject(Router);
  private _globalService = inject(GlobalService);
  private _authService = inject(AuthService);
  private _alertController = inject(AlertController);
  private _loaderService = inject(LoaderService);

  constructor() {}

  ngOnInit() {}

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  login() {
    if (this.validateForm()) {
      this.textLoader = "Iniciando Sesión";
      this._loaderService.show();

      firstValueFrom(
        this._globalService.Post("login", this.user)
      ).then((result: any) => {
        const { token, usuario } = result;

        if (usuario && usuario.changedPassword === false) {
          this._loaderService.hide();
          this.toastMessage = "Por favor, cambie su contraseña.";
          this.setOpenedToast(true);

          //Preguntar si se redirige a la página de cambio de contraseña
          this.questRedirect(usuario.id);
          return;
        }

        if (token) {
          //Guardar el token de session en el local storage
          localStorage.setItem("tokensession", token);

          // Usar el AuthService para almacenar la información del usuario
          this._authService.setUserInfo(result.usuario);

          this.toastColor = "success";
          this.toastMessage = "Bienvenido " + this.user.identificator;
          
          this._loaderService.hide();
          this.setOpenedToast(true);
          setTimeout(() => {
            this._router.navigate(["/layout/home"]);

          },1000)
        } else {
          this._loaderService.hide();
          this.toastMessage = "Usuario o contraseña incorrectos.";
          this.setOpenedToast(true);
        }
      }).catch((error:any) => {
        console.error(error);
        this._loaderService.hide();
        this.toastMessage = "Error al iniciar sesión";
        this.setOpenedToast(true);
      });
    } else {
      this.toastMessage = "Por favor, corrija los errores en el formulario.";
      this.setOpenedToast(true);
    }
  }

  async questRedirect(userId: string) {
    const alert = await this._alertController.create({
      header: "Cambiar contraseña",
      message: "¡Estas usando una contraseña temporal! ¿Deseas cambiarla?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            //console.log("Redirección cancelada");
            this.toastMessage = "Por favor, cambie su contraseña.";
            this.setOpenedToast(false);
            this.setOpenedToast(true);
          },
        },
        {
          text: "Si",
          handler: () => {
            this._router.navigate(["/reset-password/" + userId]);
          },
        },
      ],
    });

    await alert.present();
  }

  goToForgotPassword() {
    this._router.navigate(["/forgot-password"]);
  }

  goToLogin(event: any) {
    //verificar si presiono enter
    if (event.type === "keyup" && event.keyCode === 13) {
      this.login();
    }
  }

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = {
      email: "",
      password: "",
    };

    // Validación de email
    if (!this.user.identificator) {
      this.formErrors.email = "El email/usuario es requerido.";
      isValid = false;
    }

    // Validación de contraseña
    if (!this.user.password) {
      this.formErrors.password = "La contraseña es requerida.";
      isValid = false;
    }
    //  else if (this.user.password.length < 6) {
    //   this.formErrors.password =
    //     "La contraseña debe tener al menos 6 caracteres.";
    //   isValid = false;
    // }

    return isValid;
  }

  // isValidEmail(email: string): boolean {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   return emailRegex.test(email);
  // }
}
