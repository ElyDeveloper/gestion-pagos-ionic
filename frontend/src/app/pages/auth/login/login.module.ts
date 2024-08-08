import { NgModule } from "@angular/core";
import { AuthModule } from "../auth.module";
import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";

@NgModule({
  imports: [AuthModule, LoginPageRoutingModule],
  declarations: [LoginPage],
})
export class LoginPageModule {}
