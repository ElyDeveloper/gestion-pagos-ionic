import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-pago',
  templateUrl: './gestion-pago.page.html',
  styleUrls: ['./gestion-pago.page.scss'],
})
export class GestionPagoPage implements OnInit {


  constructor() { }

  ngOnInit() {
  }

  onUploaderChange(uploader: any) {
    console.log(uploader);

  }

}
