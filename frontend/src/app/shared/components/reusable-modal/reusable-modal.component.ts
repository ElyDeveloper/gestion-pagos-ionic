import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ModalConfig } from "../../utils/extra";
import { UploaderComponent } from "../uploader/uploader.component";
import { FileUploader } from "ng2-file-upload";
import { PreventAbuseService } from "../../services/prevent-abuse.service";

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
  @Input() modalConfig: ModalConfig = { fieldAliases: {} };
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() saveData = new EventEmitter<any>();

  isToastOpen = false;
  toastMessage = "Guardado correctamente";

  private _preventAbuseService = inject(PreventAbuseService);

  close = () => {
    this.setOpenedToast(false);
    this.isOpen = false;
    this.isOpenChange.emit(false);
  };

  save = async (data: any, isForm: boolean = true) => {
    if (await this._preventAbuseService.registerClick()) {
      if (isForm) {
        //console.log("Es formulario");
        if (this.formSave.invalid) {
          const invalidFields: string[] = [];

          Object.keys(this.formSave.controls).forEach((key) => {
            const control = this.formSave.get(key);
            if (control && control.invalid) {
              const fieldName = this.modalConfig.fieldAliases[key] || key;
              invalidFields.push(fieldName);
            }
          });

          this.toastMessage = `Por favor, complete correctamente los siguientes campos: ${invalidFields.join(
            ", "
          )}`;
          this.setOpenedToast(true);
        }

        this.saveData.emit(data);
      } else {
        if (data?.type === "file") {
          //console.log("No es formulario");

          this.saveData.emit();
        }

        if (data?.type === "array") {
          this.saveData.emit(data.data);
        }

      }
    }
  };

  onDidDismiss() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }
}
