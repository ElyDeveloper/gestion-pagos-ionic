import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LayoutPage } from "./layout.page";

const routes: Routes = [
  {
    path: "",
    component: LayoutPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomePageModule),
      },
      {
        path: "personas",
        loadChildren: () =>
          import("./personas/personas.module").then(
            (m) => m.PersonasPageModule
          ),
      },
      {
        path: "contratos-pago",
        loadChildren: () =>
          import("./contratos-pago/contratos-pago.module").then(
            (m) => m.ContratosPagoPageModule
          ),
      },
      {
        path: "prestamos",
        loadChildren: () =>
          import("./prestamos/prestamos.module").then(
            (m) => m.PrestamosPageModule
          ),
      },
      {
        path: "pagos",
        loadChildren: () =>
          import("./pagos/pagos.module").then((m) => m.PagosPageModule),
      },

      {
        path: "usuarios",
        loadChildren: () =>
          import("./usuarios/usuarios.module").then(
            (m) => m.UsuariosPageModule
          ),
      },
      {
        path: "gestion-contrato/:id",
        loadChildren: () =>
          import("./gestion-contract/gestion-contract.module").then(
            (m) => m.GestionContractPageModule
          ),
      },
      {
        path: "gestion-pago/:id",
        loadChildren: () =>
          import("./gestion-pago/gestion-pago.module").then(
            (m) => m.GestionPagoPageModule
          ),
      },
      {
        path: "gestion-prestamo",
        loadChildren: () =>
          import("./gestion-prestamo/gestion-prestamo.module").then(
            (m) => m.GestionPrestamoPageModule
          ),
      },
      {
        path: "reportes",
        loadChildren: () =>
          import("./reportes/reportes.module").then(
            (m) => m.ReportesPageModule
          ),
      },
      {
        path: "gestion-prestamo/:id",
        loadChildren: () =>
          import("./gestion-prestamo/gestion-prestamo.module").then(
            (m) => m.GestionPrestamoPageModule
          ),
      },
      {
        path: "view-prestamo/:id",
        loadChildren: () =>
          import("./view-prestamo/view-prestamo.module").then(
            (m) => m.ViewPrestamoPageModule
          ),
      },
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule {}
