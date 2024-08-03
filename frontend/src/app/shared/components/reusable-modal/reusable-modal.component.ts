import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-reusable-modal",
  template: `
    <ion-modal [isOpen]="isOpen" (didDismiss)="onDidDismiss()">
      <ng-container *ngIf="content">
        <ng-container
          *ngTemplateOutlet="content; context: { close: close, save: save, form:formSave }">
        </ng-container>
        <ion-toast
          [isOpen]="isToastOpen"
          message="{{ toastMessage }}"
          [duration]="5000"
          (didDismiss)="setOpenedToast(false)"></ion-toast>
      </ng-container>
    </ion-modal>
  `,
})
export class ReusableModalComponent {
  @Input() isOpen: boolean = false;
  @Input() content!: TemplateRef<any>;
  @Input() formSave!: FormGroup;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() saveData = new EventEmitter<any>();

  isToastOpen = false;
  toastMessage = "Guardado correctamente";

  close = () => {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  };

  save = (data: any) => {
    console.log("data", data);
    if (this.formSave.invalid) {
      // Mostrar qué campos son inválidos
      const invalidFields: any[] = [];

      Object.keys(this.formSave.controls).forEach((key) => {
        const control = this.formSave.get(key);
        if (control && control.invalid) {
          invalidFields.push(key);
        }
      });

      console.log("Campos inválidos:", invalidFields);

      // Puedes personalizar el mensaje para incluir los campos inválidos
      this.toastMessage = `Por favor, verifica los siguientes campos: ${invalidFields.join(
        ", "
      )}`;
      this.setOpenedToast(true);
      return;
    }

    this.saveData.emit(data);
    this.close();
  };

  onDidDismiss() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }
}
