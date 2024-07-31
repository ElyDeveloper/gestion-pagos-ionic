import { formatDate } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Column } from "../../interfaces/table";

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

  constructor() {}

  ngOnInit() {
    this.initCalendar();
    this.getDataTest();
    this.updateVisiblePages();
  }

  changePage(page: number) {
    this.currentPageOut.emit(page);
  }

  getDataTest() {
    console.log("Data deste el componente de tabla:", this.data);
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

  sortData(column: Column) {
    //TODO: Implementar lógica de ordenamiento
    // Aquí deberías implementar la lógica de ordenamiento
    // Por ejemplo, ordenar los datos y actualizar la tabla
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

  onAddButtonClick() {
    this.addButtonClicked.emit();
  }

  onEditButtonClick(data: any) {
    console.log("Editar:", data);
    // Aquí deberías abrir un modal o navegar a otra página para editar el elemento
    //TODO: Implementar lógica de edición
  }

  onDeleteButtonClick(data: any) {
    console.log("Eliminar:", data);
    // Aquí deberías abrir un modal para confirmar la eliminación del elemento
    //TODO: Implementar lógica de eliminación
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
