import { Component, Input, OnInit } from "@angular/core";
import { Column } from "../../interfaces/table";

@Component({
  selector: "card-view-info",
  template: `
    <ion-card>
      <ion-card-content>
        @for (column of columnsData; track column.key) { @if (column.key !==
        'actions') {
        <ion-item lines="none">
          <ion-label>{{ column.alias }}</ion-label>
          @switch (column.type) { @case ('boolean') {
          <ion-badge
            slot="end"
            [color]="getCellValue(element, column) ? 'success' : 'medium'">
            {{ getCellValue(element, column) ? "Activo" : "Inactivo" }}
          </ion-badge>
          } @case ('object') {
          <ion-note slot="end">{{ getCellValue(element, column) }}</ion-note>
          } @case ('date') {
          <ion-note slot="end">{{
            getCellValue(element, column) | customDate : 6 : "dd/MM/yyyy"
          }}</ion-note>
          } @case ('dni') {
          <ion-note slot="end">{{
            getCellValue(element, column) | formatDni
          }}</ion-note>
          } @case ('xml') {
          <div class="ms-2">
            <ul>
              @for (item of getCellValue(element, column) | xmlToList; track
              item) {
              <li>{{ item }}</li>
              } @empty {
              <li>No existen Elementos para mostrar.</li>
              }
            </ul>
          </div>
          <!-- <ion-note slot="end">{{
        getCellValue(element, column) | formatDni
      }}</ion-note> -->
          }@default {
          <ion-note slot="end">{{ getCellValue(element, column) }}</ion-note>
          }}
        </ion-item>
        } }
      </ion-card-content>
    </ion-card>
  `,
})
export class CardViewInfoComponent implements OnInit {
  @Input() element: any;
  @Input() columnsData: any[] = [];
  constructor() {}

  ngOnInit() {}

  getCellValue(row: any, column: Column): any {
    const primaryValue = this.getNestedValue(row, column.key);

    if (column.combineWith) {
      const secondaryValue = this.getNestedValue(row, column.combineWith);
      if (column.combineFormat) {
        return column.combineFormat(primaryValue, secondaryValue);
      }
      return `${this.formatValue(primaryValue)} ${this.formatValue(
        secondaryValue
      )}`;
    }

    return this.formatValue(primaryValue);
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

  getDateValue(row: any, key: string): any {
    const element = key.split(".").reduce((o, k) => (o || {})[k], row);

    if (element) {
      return new Date(element);
    }
    return "";
  }
}
