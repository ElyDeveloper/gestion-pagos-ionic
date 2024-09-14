import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";

@Pipe({
  name: "customDate",
})
export class CustomDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(
    value: any,
    hours: number = 6,
    format: string = "dd/MM/yyyy HH:mm:ss"
  ): string {
    if (!value) return "";
    if (value === "N/A") return "N/A";

    let date: Date;

    if (typeof value === "string") {
      // Comprobar si la fecha está en formato "dd/MM/yyyy HH:mm:ss"
      if (value.includes("/")) {
        const [datePart, timePart] = value.split(" ");
        const [day, month, year] = datePart.split("/");
        const [h, m, s] = timePart ? timePart.split(":") : [0, 0, 0];
        date = new Date(+year, +month - 1, +day, +h, +m, +s);
      } else {
        // Asumir que es una fecha ISO o un formato que new Date() puede parsear
        date = new Date(value);
      }
    } else if (value instanceof Date) {
      date = value;
    } else {
      return "";
    }

    // Añadir las horas especificadas
    date.setHours(date.getHours() + hours);

    // Formatear la fecha
    return this.datePipe.transform(date, format) || "";
  }
}
