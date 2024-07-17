import { Component, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  isModalOpen = false;
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  handleSave(data: any) {
    console.log('Datos guardados:', data);
    // Aquí puedes procesar los datos como necesites
  }
}