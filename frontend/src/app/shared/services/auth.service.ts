import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);
  private userInfo = new BehaviorSubject<Usuario | null>(null);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userInfo.next(user);
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
  }

  setUserInfo(user: Usuario): void {
    this.userInfo.next(user);

    // console.log('Usuario: ', user)
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  getUserInfo(): Observable<Usuario | null> {
    return this.userInfo.asObservable();
  }

  clearUserInfo(): void {
    localStorage.removeItem('userInfo');
    this.userInfo.next(null);
  }

  updateCredentials(body: any, id: string) {
    return this._http.put(`${API_URL}credenciales/${id}`, body);
  }

  createCredencials(body: any) {
    return this._http.post(`${API_URL}credenciales`, body);
  }
}