import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  isModalOpen = false;
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onAddButtonClicked() {
    this.isModalOpen = true;
  }


  handleSave(data: any) {
    console.log('Datos guardados:', data);
    // Aquí puedes procesar los datos como necesites
  }

  ngOnInit() {
  }

}