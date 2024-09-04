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
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-view-data",
  templateUrl: "./view-data.component.html",
  styleUrls: ["./view-data.component.scss"],
})
export class ViewDataComponent implements OnInit {
  @Input() showTitle: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() showAdd: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() context: string = "elemento";
  @Input() searchPlaceHolder: string = "Buscar...";
  @Input() showCalendar: boolean = false;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 10; // Esto debería ser dinámico basado en tus datos
  @Input() visiblePages: number[] = [];
  @Input() data: any[] = []; // Aquí deberías recibir los datos a mostrar en la tabla
  @Input() columnsData: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)
  @Input() title: string = "Sin titulo"; // Aquí deberías recibir los datos a mostrar en la tabla
  @Output() addButtonClicked = new EventEmitter<void>();
  @Output() editButtonClicked = new EventEmitter<any>();
  @Output() deleteButtonClicked = new EventEmitter<any>();
  @Output() infoButtonClicked = new EventEmitter<any>();
  @Output() selectClientClicked = new EventEmitter<any>();
  @Output() checkButtonClicked = new EventEmitter<any>();
  @Output() selectButtonClicked = new EventEmitter<any>();
  @Output() goButtonClicked = new EventEmitter<any>();
  @Output() contractButtonClicked = new EventEmitter<any>();
  @Output() pagoButtonClicked = new EventEmitter<any>();
  @Output() resetPasswordButtonClicked = new EventEmitter<any>();
  @Output() planButtonClicked = new EventEmitter<any>();
  @Output() currentPageOut = new EventEmitter<number>();
  @Output() searchOut = new EventEmitter<string>();

  search: string = "";
  searchTerm$ = new Subject<string>();

  userLogged: any = {};

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(
    this.calendar.getToday(),
    "d",
    10
  );

  private _alertController = inject(AlertController);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.getUserLoggedIn();
  }

  onDateSelection(date: any) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  getUserLoggedIn() {
    this._authService.getUserInfo().subscribe({
      next: (user: any) => {
        this.userLogged = user;
        // console.log("User logged: ", this.userLogged);
        this.initSearcher();
        this.updateVisiblePages();
      },
      error: (error) => {
        console.error("Error al obtener usuario logueado", error);
        this._router.navigate(["/login"]);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["totalPages"]) {
      this.updateVisiblePages();
    }
  }

  initSearcher() {
    this.searchTerm$
      .pipe(
        debounceTime(800), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged() // Asegura que solo se realice una búsqueda si el valor ha cambiado
      )
      .subscribe(() => {
        this.searchData();
        // this.searchEmpleado(); // Llama a la función de búsqueda cuando se cumplan las condiciones
      });
  }

  searchData() {
    this.searchOut.emit(this.search);
  }

  searchValueChanged(event: any) {
    this.searchTerm$.next(event);
  }

  getActionsColumn() {
    return this.columnsData.find((column) => column.key === "actions");
  }

  getEstadoColumn(): Column {
    return (
      this.columnsData.find((column) => column.key === "estado") || {
        key: "estado",
        alias: "Estado",
        type: "boolean",
      }
    );
  }

  getClassForOption(column: any, row: any): string {
    if (column.type !== "options") {
      return "";
    }

    const color = this.getCellColor(row, column);
    const defaultColor = "secondary";

    if (color) {
      // console.log("Color: ", color);
      return `text-bg-${color}`;
    }

    return `text-bg-${defaultColor}`;
  }

  getCellColor(row: any, column: any): string {
    const value = this.getCellValue(row, column);
    // console.log("Value: ", value);
    const columns = this.getCellColorOptions(column);
    return columns[value];
  }

  getCellOptionValue(row: any, column: any): string {
    let primaryValue = this.getNestedValue(row, column.key);

    const options = this.getCellOptions(column);
    return options[primaryValue];
  }

  getValuesArray(row: any, column: Column): any {
    let primaryValue = this.getNestedValue(row, column.key);

    // console.log("primaryValue: ", primaryValue);

    return primaryValue;
  }



  getCellValue(row: any, column: Column): any {
    let primaryValue = this.getNestedValue(row, column.key);

    if (column.combineWith) {
      const secondaryValue = this.getNestedValue(row, column.combineWith);
      if (column.combineFormat) {
        if (primaryValue && secondaryValue) {
          return column.combineFormat(primaryValue, secondaryValue);
        }
      }
      return `${this.formatValue(primaryValue)} ${this.formatValue(
        secondaryValue
      )}`;
    }

    if (column.addText) {
      const secondaryValue = column.texto;
      return column.addText(primaryValue, secondaryValue);
    }

    // console.log('primaryValue', primaryValue);
    return this.formatValue(primaryValue);
  }

  getImageUrl(row: any, column: any): string {
    const urlKey = column.imageUrl;
    const urlValue = this.getCellValue(row, { key: urlKey, alias: "Imagen" });
    const onlyIdentifier = urlValue.split("/").pop();
    // console.log(onlyIdentifier);

    if (onlyIdentifier) {
      return onlyIdentifier;
    }
    return "";
  }

  getCellOptions(column: Column): string[] {
    return column.options || [];
  }

  getCellPropsVisibles(column: Column): string[] {
    return column.propsVisibles || [];
  }

  getCellColorOptions(column: Column): string[] {
    return column.colorOptions || [];
  }

  private getNestedValue(obj: any, key: string): any {
    return key.split(".").reduce((o, k) => (o || {})[k], obj);
  }

  private formatValue(value: any): string {
    if (value && typeof value === "object") {
      return value.nombre || JSON.stringify(value);
    }
    return value !== undefined && value !== null ? value.toString() : "";
  }

  // Este método ya no es necesario, pero lo mantenemos por compatibilidad
  getObjectValue(row: any, key: string): any {
    const value = this.getNestedValue(row, key);
    return this.formatValue(value);
  }

  changePage(page: number) {
    this.currentPageOut.emit(page);
  }

  hasActionsColumn(): boolean {
    return this.columnsData.some((col) => col.key === "actions");
  }

  hasResetPswdColumn(): boolean {
    return this.columnsData.some((col) => col.type === "pswd");
  }

  onActionClick(row: any, action: string) {
    switch (action) {
      case "edit":
        this.onEditButtonClick(row);
        break;
      case "info":
        this.onInfoButtonClick(row);
        break;
      case "delete":
        this.onDeleteButtonClick(row);
        break;
      case "check":
        this.onCheckButtonClick(row);
        break;
      case "select":
        this.onSelectButtonClick(row);
        break;
      case "go":
        this.onGoButtonClicked(row);
        break;
      case "contract":
        this.onContractButtonClick(row);
        break;
      case "pay":
        this.onPagoButtonClick(row);
        break;
      case "plan":
        this.onInfoPlan(row);
        break;
      case "asignClients":
        this.onSelectClients(row);
        break;
      case "resetPswd":
        this.onResetPassword(row);
        break;
      // Añade más casos según sea necesario
    }
  }

  onAddButtonClick() {
    this.addButtonClicked.emit();
  }

  onEditButtonClick(data: any) {
    this.editButtonClicked.emit(data);
  }

  onInfoButtonClick(data: any) {
    this.infoButtonClicked.emit(data);
  }

  onCheckButtonClick(data: any) {
    this.checkButtonClicked.emit(data);
  }
  onSelectButtonClick(data: any) {
    this.selectButtonClicked.emit(data);
  }
  onGoButtonClicked(data: any) {
    this.goButtonClicked.emit(data);
  }

  onContractButtonClick(data: any) {
    this.contractButtonClicked.emit(data);
  }
  onPagoButtonClick(data: any) {
    this.pagoButtonClicked.emit(data);
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

  onInfoPlan(data: any) {
    console.log("Se click en plan");
    this.planButtonClicked.emit(data);
  }

  onSelectClients(data: any) {
    console.log("Se click en seleccionar clientes");
    this.selectClientClicked.emit(data);
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
