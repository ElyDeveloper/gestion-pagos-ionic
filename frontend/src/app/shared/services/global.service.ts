import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { interval, Observable } from "rxjs";
import { environment } from "src/environments/environment";

const API_URL = environment.apiURL;
@Injectable({
  providedIn: "root",
})
export class GlobalService {
  private unidades: string[] = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  private decenas: string[] = [
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  private especiales: string[] = [
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

  private _http = inject(HttpClient);
  constructor() {}

  Get(endPoint: string) {
    return this._http.get(`${API_URL}${endPoint}`);
  }
  GetId(endPoint: string, Id: number) {
    return this._http.get(`${API_URL}${endPoint}/${Id}`);
  }

  downloadFile(endPoint: string, Id: number): Observable<HttpResponse<Blob>> {
    return this._http.get(`${API_URL}${endPoint}/${Id}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  GetIdDecrypted(endPoint: string, Id: string) {
    return this._http.get(`${API_URL}${endPoint}/${Id}`);
  }
  GetIdEncrypted(endPoint: string, Id: number) {
    return this._http.get(`${API_URL}${endPoint}/${Id}`);
  }
  GetManyById(endPoint: string, Id: number) {
    return this._http.get<any[]>(`${API_URL}${endPoint}/${Id}`);
  }
  GetIdString(endPoint: string, Id: string) {
    return this._http.get(`${API_URL}${endPoint}/${Id}`);
  }
  Post(endPoint: string, body: any) {
    return this._http.post(`${API_URL}${endPoint}`, body);
  }

  PostWithFile(endPoint: string, dataSend: any, selectedFile?: File) {
    const formData = new FormData();

    formData.append("data", JSON.stringify(dataSend));

    // Añadir el archivo si existe
    if (selectedFile) {
      formData.append("file", selectedFile, selectedFile.name);
    }

    return this._http.post(`${API_URL}${endPoint}`, formData);
  }

  PatchWithFile(endPoint: string, dataSend: any, selectedFile: File | null) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(dataSend));
    // Añadir el archivo si existe
    if (selectedFile) {
      formData.append("file", selectedFile, selectedFile.name);
    }

    //console.log("Data a enviar en acualizacion: ", dataSend);

    return this._http.patch(`${API_URL}${endPoint}`, formData);
  }

  PutId(endPoint: string, Id: number, body: any) {
    return this._http.put(`${API_URL}${endPoint}/${Id}`, body);
  }

  PutIdString(endPoint: string, Id: string, body: any) {
    return this._http.put(`${API_URL}${endPoint}/${Id}`, body);
  }
  Delete(endPoint: string, Id: number) {
    return this._http.delete(`${API_URL}${endPoint}/${Id}`);
  }

  DeleteString(endPoint: string, Id: string) {
    return this._http.delete(`${API_URL}${endPoint}/${Id}`);
  }
  Patch(endPoint: string, Id: number, body: any) {
    return this._http.patch(`${API_URL}${endPoint}/${Id}`, body);
  }

  PostFull(endPoint: string, id: number, body: any) {
    return this._http.post(`${API_URL}${endPoint}/${id}`, body);
  }

  GetLastElement(endPoint: string) {
    return this._http.get(`${API_URL}${endPoint}`);
  }

  parseObjectDates(obj: any): any {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === "string" && this.isISODate(value)) {
          obj[key] = this.formatDateForInput(value);
        } else if (typeof value === "object") {
          // Aquí es donde maneja la anidación
          this.parseObjectDates(value);
        }
      }
    }

    return obj;
  }

  formatDateForInput(dateString: string): string {
    return dateString.split("T")[0];
  }

  private isISODate(str: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str);
  }

  numberToText(numero: number): string {
    if (numero < 0 || numero > 99) {
      return "Número fuera de rango";
    }

    if (numero < 10) {
      return this.unidades[numero];
    }

    if (numero < 20) {
      return this.especiales[numero - 11];
    }

    const unidad = numero % 10;
    const decena = Math.floor(numero / 10);

    if (unidad === 0) {
      return this.decenas[decena - 1];
    }

    return `${this.decenas[decena - 1]} y ${this.unidades[unidad]}`;
  }
}
