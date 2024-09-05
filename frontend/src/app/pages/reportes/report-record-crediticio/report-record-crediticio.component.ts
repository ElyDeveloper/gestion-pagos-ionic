import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-record-crediticio',
  templateUrl: './report-record-crediticio.component.html',
  styleUrls: ['../reportes.page.scss'],
})
export class ReportRecordCrediticioComponent  implements OnInit {
  @Input() company: string = 'Company N/D';
  constructor() { }

  ngOnInit() {}

}
