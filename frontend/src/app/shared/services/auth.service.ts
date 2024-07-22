import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _http = inject(HttpClient);
  constructor() { }

  updateCredentials(body:any){
    return this._http.put(`${API_URL}update-credentials`,body)
  }

  createCredencials(body:any){
    return this._http.post(`${API_URL}create-credentials`,body)
  }
}
