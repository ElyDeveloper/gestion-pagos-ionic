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
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  Subject,
} from "rxjs";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { PreventAbuseService } from "../../services/prevent-abuse.service";

@Component({
  selector: "app-view-data",
  templateUrl: "./view-data.component.html",
  styleUrls: ["./view-data.component.scss"],
})
export class ViewDataComponent implements OnInit {
  @Input() showTitle: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() showAdd: boolean = true;
  @Input() showFilter: boolean = false;
  @Input() state: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() isPrint: boolean = false;
  @Input() context: string = "elemento";
  @Input() searchPlaceHolder: string = "Buscar...";
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 10; // Esto debería ser dinámico basado en tus datos
  @Input() visiblePages: number[] = [];
  @Input() data: any[] = []; // Aquí deberías recibir los datos a mostrar en la tabla
  @Input() columnsData: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)
  @Input() title: string = "Sin titulo"; // Aquí deberías recibir los datos a mostrar en la tabla
  @Output() filterButtonClicked = new EventEmitter<void>();
  @Output() addButtonClicked = new EventEmitter<void>();
  @Output() editButtonClicked = new EventEmitter<any>();
  @Output() deleteButtonClicked = new EventEmitter<any>();
  @Output() infoButtonClicked = new EventEmitter<any>();
  @Output() selectClientClicked = new EventEmitter<any>();
  @Output() transferClicked = new EventEmitter<any>();
  @Output() checkButtonClicked = new EventEmitter<any>();
  @Output() selectButtonClicked = new EventEmitter<any>();
  @Output() openButtonClicked = new EventEmitter<any>();
  @Output() uploadButtonClicked = new EventEmitter<any>();
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

  private _alertController = inject(AlertController);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _preventAbuseService = inject(PreventAbuseService);

  constructor() {}

  ngOnInit() {
    this.getUserLoggedIn();
  }

  getUserLoggedIn() {
    firstValueFrom(this._authService.getUserInfo())
      .then((user: any) => {
        this.userLogged = user;
        //console.log("User logged: ", this.userLogged);
        this.initSearcher();
        this.updateVisiblePages();
      })
      .catch((error) => {
        console.error("Error al obtener usuario logueado", error);
        this._router.navigate(["/login"]);
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
      // //console.log("Color: ", color);
      return `text-bg-${color}`;
    }

    return `text-bg-${defaultColor}`;
  }

  getCellColor(row: any, column: any): string {
    const value = this.getCellValue(row, column);
    // //console.log("Value: ", value);
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

    // //console.log("primaryValue: ", primaryValue);

    return primaryValue;
  }

  getCellValue(row: any, column: Column): any {
    let primaryValue = this.getNestedValue(row, column.key);

    if (primaryValue === null && column.type !== "currency") {
      return "N/A";
    }

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

    // //console.log('primaryValue', primaryValue);
    return this.formatValue(primaryValue);
  }

  getImageUrl(row: any, column: any): string {
    const urlKey = column.imageUrl;
    const urlValue = this.getCellValue(row, { key: urlKey, alias: "Imagen" });
    const onlyIdentifier = urlValue.split("/").pop();
    // //console.log(onlyIdentifier);

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
      case "upload":
        this.onUpload(row);
        break;
      case "open":
        this.onOpen(row);
        break;
      case "asignClients":
        this.onSelectClients(row);
        break;
      case "transfer":
        this.onTransfer(row);
        break;
      case "resetPswd":
        this.onResetPassword(row);
        break;
      // Añade más casos según sea necesario
    }
  }

  async onFilterClick() {
    if (await this._preventAbuseService.registerClick()) {
      this.filterButtonClicked.emit();
    }
  }
  async onAddButtonClick() {
    if (await this._preventAbuseService.registerClick()) {
      this.addButtonClicked.emit();
    }
  }

  async onEditButtonClick(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.editButtonClicked.emit(data);
    }
  }

  async onInfoButtonClick(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.infoButtonClicked.emit(data);
    }
  }

  async onCheckButtonClick(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.checkButtonClicked.emit(data);
    }
  }

  async onSelectButtonClick(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.selectButtonClicked.emit(data);
    }
  }

  async onGoButtonClicked(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.goButtonClicked.emit(data);
    }
  }

  async onContractButtonClick(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.contractButtonClicked.emit(data);
    }
  }

  async onPagoButtonClick(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.pagoButtonClicked.emit(data);
    }
  }

  async onDeleteButtonClick(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      const alert = await this._alertController.create({
        header: "Eliminar elemento",
        message: "¿Realmente deseas eliminar este elemento?",
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              //console.log("Eliminación cancelada");
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
  }

  async onResetPassword(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.resetPasswordButtonClicked.emit(data);
    }
  }

  async onInfoPlan(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.planButtonClicked.emit(data);
    }
  }

  async onUpload(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      this.uploadButtonClicked.emit(data);
    }
  }

  async onOpen(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      //console.log("Se click en abrir");
      this.openButtonClicked.emit(data);
    }
  }

  async onSelectClients(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      //console.log("Se click en seleccionar clientes");
      this.selectClientClicked.emit(data);
    }
  }
  async onTransfer(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      //console.log("Se click en seleccionar clientes");
      this.transferClicked.emit(data);
    }
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
    console.log("Ir a la página", page);
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
