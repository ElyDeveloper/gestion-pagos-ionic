import { Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

@Component({
  selector: "app-reusable-modal",
  template: `
    <ion-modal [isOpen]="isOpen" (didDismiss)="onDidDismiss()" >
      <ng-container *ngIf="content">
        <ng-container
          *ngTemplateOutlet="content; context: { close: close, save: save }">
        </ng-container>
      </ng-container>
    </ion-modal>
  `,
})
export class ReusableModalComponent {
  @Input() isOpen: boolean = false;
  @Input() content!: TemplateRef<any>;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() saveData = new EventEmitter<any>();

  close = () => {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  };

  save = (data: any) => {
    this.saveData.emit(data);
    this.close();
  };

  onDidDismiss() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}