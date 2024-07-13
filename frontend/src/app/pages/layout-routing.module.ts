import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutPage } from './layout.page';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'clientes',
        loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesPageModule)
      },
      {
        path: 'contratos-pago',
        loadChildren: () => import('./contratos-pago/contratos-pago.module').then( m => m.ContratosPagoPageModule)
      },
      {
        path: 'prestamos',
        loadChildren: () => import('./prestamos/prestamos.module').then( m => m.PrestamosPageModule)
      },
      {
        path: 'pagos',
        loadChildren: () => import('./pagos/pagos.module').then( m => m.PagosPageModule)
      },
      {
        path: 'reportes-pagos',
        loadChildren: () => import('./reportes-pagos/reportes-pagos.module').then( m => m.ReportesPagosPageModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule {}
