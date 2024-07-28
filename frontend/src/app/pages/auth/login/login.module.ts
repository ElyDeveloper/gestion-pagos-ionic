import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/components/shared.module";
import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";

@NgModule({
  imports: [SharedModule, LoginPageRoutingModule],
  declarations: [LoginPage],
})
export class LoginPageModule {}
