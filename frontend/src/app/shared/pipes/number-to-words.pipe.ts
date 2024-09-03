import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberToWords",
})
export class NumberToWordsPipe implements PipeTransform {
  private unidades = [
    "",
    "un",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  private especiales = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  private decenas = [
    "",
    "diez",
    "veinti",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  private centenas = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  transform(value: number, currency: string = "lempiras"): string {
    if (isNaN(value)) return "";

    const entero = Math.floor(value);
    const decimal = Math.round((value - entero) * 100);

    let resultado = this.convertirGrupo(entero);

    if (decimal > 0) {
      resultado = `${resultado} ${currency} con ${this.convertirGrupo(
        decimal
      )} centavos`;
    } else {
      resultado = `${resultado} ${currency} exactos`;
    }

    return resultado;
  }

  private convertirGrupo(numero: number): string {
    if (numero === 0) return "cero";
    if (numero < 10) return this.unidades[numero];
    if (numero < 20) return this.especiales[numero - 10];
    if (numero < 30) return this.decenas[2] + this.unidades[numero % 10];
    if (numero < 100) {
      const unidad = numero % 10;
      const decena = Math.floor(numero / 10);
      return (
        this.decenas[decena] + (unidad ? " y " + this.unidades[unidad] : "")
      );
    }
    if (numero < 1000) {
      const centena = Math.floor(numero / 100);
      const resto = numero % 100;
      if (resto === 0 && centena === 1) return "cien";
      return (
        this.centenas[centena] + (resto ? " " + this.convertirGrupo(resto) : "")
      );
    }
    if (numero < 1000000) {
      const miles = Math.floor(numero / 1000);
      const resto = numero % 1000;
      if (miles === 1)
        return "mil" + (resto ? " " + this.convertirGrupo(resto) : "");
      return (
        this.convertirGrupo(miles) +
        " mil" +
        (resto ? " " + this.convertirGrupo(resto) : "")
      );
    }
    // Puedes continuar agregando más casos para números más grandes
    return "número fuera de rango";
  }

  private capitalizarPrimeraLetra(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
