import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ILogin } from '../interfaces/login.interface';
import { map, tap } from 'rxjs/operators';
export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';;

// const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

// const httpOptions = {
//   headers,
//   responseType: 'text' as 'json'
// }
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loginUrl = 'http://localhost:8080/login';
  openLoginModal = new Subject<boolean>();
  isAuth = new Subject<boolean>();

  get token(): string {
    const expDate = new Date(localStorage.getItem('expDate') || '');
    if (new Date() > expDate) {
      this.logout();
      return '';
    }
    return localStorage.getItem('token') || '';
  }

  constructor(private http: HttpClient) {}

  signIn(loginData: ILogin): Observable<any> {
    return this.http
      .post<any>(this.loginUrl, loginData);
  }

  logout(): void {
    this.setToken(null);
    this.isAuth.next(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  public setToken(response: any): void {
    if (response) {
      const expDate = new Date(new Date().getTime() + 36000000);
      localStorage.setItem('token', response.token);
      localStorage.setItem('expDate', expDate.toString());
      this.isAuth.next(this.isAuthenticated());
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('expDate');

      // change this later
    }
  }
}