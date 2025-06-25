import { Injectable } from '@angular/core';
import { Subject, Observable, tap, catchError, throwError } from 'rxjs';
import { CommonHelper } from './common-helper.service';
import { HttpHelperService } from './http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public tokenSubject = new Subject<any>();
  constructor(private http: HttpHelperService) { }

  public isLogin(): boolean {
    if (this.isLocalStorageAvailable()) {
      let token = localStorage.getItem("Token");
      return token == null ? false : true;
    }
    return false;
  }

  public isTokenExpired(token: any): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  }

  public isRefreshTokenExpired(date: Date): boolean {
    const expireTime = new Date(date);
    const now = new Date().getTime(); // Get timestamp (ms)
    return expireTime.getTime() < now;
  }

  public GetCurrentUserRole(): string {
    try {
      let token = localStorage.getItem("Token");
      if (!token) {
        return ""
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (error) {
      return "";
    }
  }

  public isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && 'localStorage' in window;
  }

  public setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    }
  }

  public getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  public removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

  public clear(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
    }
  }

  refreshToken(): Observable<any> {
    let currentUser = CommonHelper.GetUser();
    const payload =
    {
      userId: currentUser?.userId,
      refreshToken: currentUser?.refreshToken
    }
    return this.http.Login(`Auth/RefreshToken`,payload).pipe(
      tap((res: any) => {
        localStorage.setItem("Token", res.jwtToken)
        localStorage.setItem("UserResponseDto", JSON.stringify(res))
      }),
      catchError((error: any) => {
        console.log("refreshToken Error : ", error)
        return throwError(() => new Error(error));
      })
    );
  }
}
