import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { interval } from "rxjs";
import { environment } from "src/environments/environment";

const API_URL = environment.apiURL;
@Injectable({
  providedIn: "root",
})
export class GlobalService {
  private _http = inject(HttpClient);
  constructor() {}

  Get(endPoint: string) {
    return this._http.get(`${API_URL}${endPoint}`);
  }
  GetId(endPoint: string, Id: number) {
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

  PostWithFile(endPoint: string, selectedFile: File, empleado: any) {
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    formData.append("empleado", JSON.stringify(empleado));

    return this._http.post(`${API_URL}${endPoint}`, formData);
  }
  PutId(endPoint: string, Id: number, body: any) {
    return this._http.put(`${API_URL}${endPoint}/${Id}`, body);
  }
  Delete(endPoint: string, Id: number) {
    return this._http.delete(`${API_URL}/${endPoint}/${Id}`);
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

}
