import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/auth/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "forgot-password",
    loadChildren: () =>
      import("./pages/auth/forgot-password/forgot-password.module").then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: "reset-password/:id",
    loadChildren: () =>
      import("./pages/auth/reset-password/reset-password.module").then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: "verify-code",
    loadChildren: () =>
      import("./pages/auth/verify-code/verify-code.module").then(
        (m) => m.VerifyCodePageModule
      ),
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/auth/register/register.module").then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: "layout",
    loadChildren: () =>
      import("./pages/layout.module").then((m) => m.LayoutPageModule),
  },
  {
    path: "view-file/:id",
    loadChildren: () =>
      import("./pages/view-files/view-files.module").then(
        (m) => m.ViewFilesPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
