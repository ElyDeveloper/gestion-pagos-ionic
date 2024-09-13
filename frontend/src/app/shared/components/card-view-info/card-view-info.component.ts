import { Component, Input, OnInit } from "@angular/core";
import { Column } from "../../interfaces/table";
import { DatePipe } from "@angular/common";

@Component({
  selector: "card-view-info",
  template: `
    <ion-card>
      <ion-card-content>
        <ion-list lines="none">
          @for (column of columnsData; track column.key) { @if (column.key !==
          'actions') {
          <ion-item>
            <ion-label>{{ column.alias }}</ion-label>
            <ng-container [ngSwitch]="column.type">
              <ion-badge
                *ngSwitchCase="'boolean'"
                slot="end"
                [color]="getCellValue(element, column) ? 'success' : 'medium'">
                {{ getCellValue(element, column) ? "Activo" : "Inactivo" }}
              </ion-badge>
              <ion-note *ngSwitchCase="'object'" slot="end">{{
                getCellValue(element, column)
              }}</ion-note>
              <ion-note *ngSwitchCase="'date'" slot="end">{{
                getCellValue(element, column) | customDate : 6 : "dd/MM/yyyy"
              }}</ion-note>
              <ion-note *ngSwitchCase="'dni'" slot="end">{{
                getCellValue(element, column) | formatDni
              }}</ion-note>
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
              <ion-note *ngSwitchDefault slot="end">{{
                getCellValue(element, column)
              }}</ion-note>
            </ng-container>
          </ion-item>
          } }
        </ion-list>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      ion-card {
        margin: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }
      ion-item {
        --padding-start: 0;
        --inner-padding-end: 0;
      }
      ion-label {
        font-weight: 500;
      }
      ion-note {
        font-size: 14px;
      }
      ion-badge {
        --padding-start: 8px;
        --padding-end: 8px;
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

    if(!primaryValue) return "N/A";

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
