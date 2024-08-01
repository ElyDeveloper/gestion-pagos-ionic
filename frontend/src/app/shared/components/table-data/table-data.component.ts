import { formatDate } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Column } from "../../interfaces/table";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-table-data",
  templateUrl: "./table-data.component.html",
  styleUrls: ["./table-data.component.scss"],
})
export class TableDataComponent implements OnInit {
  @Input() showAdd: boolean = true;
  @Input() showCalendar: boolean = false;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 10; // Esto debería ser dinámico basado en tus datos
  @Input() visiblePages: number[] = [];
  @Input() data: any[] = []; // Aquí deberías recibir los datos a mostrar en la tabla
  @Input() columnsData: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)
  @Input() title: string = "Sin titulo"; // Aquí deberías recibir los datos a mostrar en la tabla
  @Input() searchTerm: string = "";
  @Output() addButtonClicked = new EventEmitter<void>();
  @Output() editButtonClicked = new EventEmitter<any>();
  @Output() deleteButtonClicked = new EventEmitter<any>();
  @Output() resetPasswordButtonClicked = new EventEmitter<any>();
  @Output() currentPageOut = new EventEmitter<number>();

  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  months = [
    { name: "Enero", value: 1 },
    { name: "Febrero", value: 2 },
    { name: "Marzo", value: 3 },
    { name: "Abril", value: 4 },
    { name: "Mayo", value: 5 },
    { name: "Junio", value: 6 },
    { name: "Julio", value: 7 },
    { name: "Agosto", value: 8 },
    { name: "Septiembre", value: 9 },
    { name: "Octubre", value: 10 },
    { name: "Noviembre", value: 11 },
    { name: "Diciembre", value: 12 },
  ];
  years: number[] = [];

  private _alertController = inject(AlertController);
  constructor() {}

  ngOnInit() {
    this.initCalendar();
    this.updateVisiblePages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["totalPages"]) {
      this.updateVisiblePages();
    }
  }

  getCellValue(row: any, key: string): any {
    return key.split(".").reduce((o, k) => (o || {})[k], row);
  }

  changePage(page: number) {
    this.currentPageOut.emit(page);
  }

  initCalendar() {
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = new Date().getFullYear();
    const currentYear = new Date().getFullYear();

    // this.getYears();
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      this.years.push(year);
    }
  }

  getYears() {
    //TODO: Consultar años desde el backend
    return this.years;
  }

  onMonthChange() {
    console.log(
      "Selected month and year:",
      this.selectedMonth,
      this.selectedYear
    );
    // Realiza aquí la lógica necesaria al cambiar el mes y el año
    //TODO: Consultar datos desde el backend
  }

  hasActionsColumn(): boolean {
    return this.columnsData.some((col) => col.key === "actions");
  }

  hasResetPswdColumn(): boolean {
    return this.columnsData.some((col) => col.type === "pswd");
  }

  onAddButtonClick() {
    this.addButtonClicked.emit();
  }

  onEditButtonClick(data: any) {
    this.editButtonClicked.emit(data);
  }

  async onDeleteButtonClick(data: any) {
    const alert = await this._alertController.create({
      header: "Eliminar elemento",
      message: "¿Realmente deseas eliminar este elemento?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Eliminación cancelada");
          },
        },
        {
          text: "Eliminar",
          handler: () => {
            this.deleteButtonClicked.emit(data);
          },
        },
      ],
    });

    await alert.present();
  }

  onResetPassword(data: any) { 
    this.resetPasswordButtonClicked.emit(data);
  }

  onSearchChange(event: any) {
    console.log("Búsqueda:", this.searchTerm);
    // Aquí puedes implementar la lógica de búsqueda
    // Por ejemplo, filtrar los datos y actualizar la tabla
    //TODO: Implementar lógica de búsqueda
  }

  updateVisiblePages() {
    this.visiblePages = [];
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 3);

    if (endPage - startPage < 3) {
      startPage = Math.max(1, endPage - 3);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.currentPageOut.emit(this.currentPage);
      this.updateVisiblePages();
      // Aquí deberías cargar los datos correspondientes a la página seleccionada
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }
}
