import { Component, Input, OnInit } from "@angular/core";
import { Column } from "../../interfaces/table";

@Component({
  selector: "card-view-info",
  templateUrl: "./card-view-info.component.html",
  styleUrls: ["./card-view-info.component.scss"],
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
