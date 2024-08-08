import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SplashScreen } from "@capacitor/splash-screen";
import { ValidatorFn, AbstractControl } from "@angular/forms";
import { GlobalService } from "src/app/shared/services/global.service";
import { CookieService } from "ngx-cookie-service";
import { key } from "src/app/libraries/key.library";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { AuthService } from "src/app/shared/services/auth.service";
import { Usuario } from "src/app/shared/interfaces/usuario";

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
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;
  textLoader: string = "Cargando";
  user: Login = {
    identificator: "",
    password: "",
  };
  isToastOpen: boolean = false;
  toastMessage: string = "";
  formErrors: any = {
    email: "",
    password: "",
  };

  _router = inject(Router);
  _globalService = inject(GlobalService);
  _cookieService = inject(CookieService);
  _authService = inject(AuthService);
  constructor() {}

  ngOnInit() {}

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  async login() {
    if (this.validateForm()) {
      this.textLoader = "Iniciando Sesión";
      this.loaderComponent.show();

      this._globalService.Post("login", this.user).subscribe((result: any) => {
        if (result?.token) {
          this._cookieService.set(
            "tokensession",
            result.token,
            key.TOKEN_EXPIRATION_TIME,
            ""
          );

          // Usar el AuthService para almacenar la información del usuario
          this._authService.setUserInfo(result.usuario);

          setTimeout(() => {
            this.loaderComponent.hide();
            this.toastMessage = "Bienvenido " + this.user.identificator;
            this.setOpenedToast(true);
            this._router.navigate(["/layout"]);
          }, 2000);
        } else {
          this.loaderComponent.hide();
          this.toastMessage = "Usuario o contraseña incorrectos.";
          this.setOpenedToast(true);
        }
      });
    } else {
      this.toastMessage = "Por favor, corrija los errores en el formulario.";
      this.setOpenedToast(true);
    }
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
      this.formErrors.email = "El email es requerido.";
      isValid = false;
    } else if (!this.isValidEmail(this.user.identificator)) {
      this.formErrors.email = "Por favor, ingrese un email válido.";
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

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
