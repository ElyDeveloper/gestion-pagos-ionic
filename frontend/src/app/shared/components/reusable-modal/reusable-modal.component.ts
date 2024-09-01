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
          *ngTemplateOutlet="
            content;
            context: { close: close, save: save, form: formSave }
          ">
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
  @Input() modalConfig: any;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() saveData = new EventEmitter<any>();

  isToastOpen = false;
  toastMessage = "Guardado correctamente";

  close = () => {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  };

  save = (data: any, isForm: boolean = true) => {
    
    console.log("data", data);
    if (isForm) {
      if (this.formSave.invalid) {
        const invalidFields: string[] = [];
  
        Object.keys(this.formSave.controls).forEach((key) => {
          const control = this.formSave.get(key);
          if (control && control.invalid) {
            // Usar el alias del campo si está disponible, de lo contrario usar la clave
            const fieldName = this.modalConfig.fieldAliases[key] || key;
            invalidFields.push(fieldName);
          }
        });
  
        console.log("Campos inválidos:", invalidFields);
  
        this.toastMessage = `Por favor, complete correctamente los siguientes campos: ${invalidFields.join(
          ", "
        )}`;
        this.setOpenedToast(true);
        return;
      }
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
