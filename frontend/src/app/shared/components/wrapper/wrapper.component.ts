import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  template: `
  <app-loader [textLoader]="textLoader"></app-loader>
  <ion-toast
    [isOpen]="isToastOpen"
    message="{{toastMessage}}"
    [duration]="5000"
    [color]="toastColor"
    (didDismiss)="setOpenedToast(false)"></ion-toast>

  <app-breadcrumb *ngIf="showBreadcrumb"></app-breadcrumb>
  `
})
export class WrapperComponent implements OnInit {
  @Input() textLoader: string = 'Cargando';
  @Input() toastMessage: string = 'Operacion realizada con éxito!';
  @Input() toastColor: string = 'primary';
  @Input() isToastOpen: boolean = false;
  @Input() showBreadcrumb: boolean = true;

  @Output() isToastOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() { }
  
  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
    this.isToastOpenChange.emit(value);
  }



}
