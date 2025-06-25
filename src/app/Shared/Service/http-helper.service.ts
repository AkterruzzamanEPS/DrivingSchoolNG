import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {
  appUrl = "https://localhost:7278/api/";
  // appUrl = "http://103.192.159.61:8010/api/";

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return headers;
  }

  Get<T>(URL: string,): Observable<T> {
    return this.http.get<T>(this.appUrl + URL, { headers: this.getHeaders() });
  }

  Post<T>(URL: string, object: any,): Observable<T> {
    return this.http.post<T>(this.appUrl + URL, object, { headers: this.getHeaders() });
  }

  Put<T>(URL: string, object: any,): Observable<T> {
    return this.http.put<T>(this.appUrl + URL, object, { headers: this.getHeaders() });
  }

  GetWithFileDownload(URL: string, responseType: 'json' | 'blob' = 'json'): Observable<any> {
    let headers = new HttpHeaders();
    let options: any = { headers, responseType };
    return this.http.get(this.appUrl + URL, options);
  }

  Login<T>(URL: string, object: any): Observable<T> {
    return this.http.post<T>(this.appUrl + URL, object, { headers: this.getHeaders() });
  }

  UploadFile(URL: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.appUrl + URL, formData, {
      headers: new HttpHeaders({ 'Show-Loader': 'true' })
    });
  }
  UploadFile1(URL: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.appUrl + URL, formData,
      { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  // Helper Methods
  private async toArrayBuffer(text: string): Promise<ArrayBuffer> {
    return new TextEncoder().encode(text).buffer;
  }

}
