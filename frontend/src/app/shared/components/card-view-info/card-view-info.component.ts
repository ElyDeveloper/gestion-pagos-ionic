import { Component, Input, OnInit } from "@angular/core";
import { Column } from "../../interfaces/table";
import { DatePipe } from "@angular/common";

@Component({
  selector: "card-view-info",
  template: `
    <ion-grid>
      <ion-row>
        @for (column of columnsData; track column.key) { @if (column.key !==
        'actions') {
        <ion-col size="4">
          <ion-item lines="none">
            <ion-label
              ><strong>{{ column.alias }}:</strong></ion-label
            >
          </ion-item>
        </ion-col>
        <ion-col size="8">
          <ion-item lines="none">
            <ng-container [ngSwitch]="column.type">
              <ion-badge
                *ngSwitchCase="'boolean'"
                [color]="getCellValue(element, column) ? 'success' : 'medium'">
                {{ getCellValue(element, column) ? "Activo" : "Inactivo" }}
              </ion-badge>
              <ion-text *ngSwitchCase="'object'">{{
                getCellValue(element, column)
              }}</ion-text>
              <ion-text *ngSwitchCase="'date'">{{
                getCellValue(element, column) | customDate : 6 : "dd/MM/yyyy"
              }}</ion-text>
              <ion-text *ngSwitchCase="'dni'">{{
                getCellValue(element, column) | formatDni
              }}</ion-text>
              <ion-text *ngSwitchCase="'currency'">{{
                getCellValue(element, column) | currency : "L" : "symbol"
              }}</ion-text>
              <ng-container *ngSwitchCase="'xml'">
                <ion-list>
                  @for (item of getCellValue(element, column) | xmlToList; track
                  item) {
                  <ion-item lines="none">
                    <ion-label>{{ item }}</ion-label>
                  </ion-item>
                  } @empty {
                  <ion-item lines="none">
                    <ion-label color="medium"
                      >No existen elementos para mostrar.</ion-label
                    >
                  </ion-item>
                  }
                </ion-list>
              </ng-container>
              <ion-text *ngSwitchDefault>{{
                getCellValue(element, column)
              }}</ion-text>
            </ng-container>
          </ion-item>
        </ion-col>
        } }
      </ion-row>
    </ion-grid>
  `,
  styles: [
    `
      ion-grid {
        border: 1px solid #ddd;
      }

      ion-row {
        border-bottom: 1px solid #ddd;
      }

      ion-col {
        border: 1px solid #ddd;
        padding: 10px;
      }
    `,
  ],
})
export class CardViewInfoComponent implements OnInit {
  @Input() element!: any;
  @Input() columnsData: Column[] = [];

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    if (!this.element || !this.columnsData.length) {
      console.warn("CardViewInfoComponent: element or columnsData is missing");
    }
  }

  getCellValue(row: any, column: Column): any {
    const primaryValue = this.getNestedValue(row, column.key);

    if (!primaryValue) return "N/A";

    if (column.combineWith) {
      const secondaryValue = this.getNestedValue(row, column.combineWith);
      return column.combineFormat
        ? column.combineFormat(primaryValue, secondaryValue)
        : `${this.formatValue(primaryValue)} ${this.formatValue(
            secondaryValue
          )}`;
    }

    return this.formatValue(primaryValue, column.type);
  }

  private getNestedValue(obj: any, key: string): any {
    return key.split(".").reduce((o, k) => (o || {})[k], obj);
  }

  private formatValue(value: any, type?: string): string {
    if (value == null) return "";

    switch (type) {
      case "date":
        return this.datePipe.transform(value, "dd/MM/yyyy") || "";
      case "object":
        return value.nombre || JSON.stringify(value);
      default:
        return String(value);
    }
  }
}
