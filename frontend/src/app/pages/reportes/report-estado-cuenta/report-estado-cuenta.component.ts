import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-estado-cuenta',
  templateUrl: './report-estado-cuenta.component.html',
  styleUrls: ['../reportes.page.scss'],
})
export class ReportEstadoCuentaComponent  implements OnInit {
  @Input() company: string = 'Company N/D';

  constructor() { }

  ngOnInit() {}

}
