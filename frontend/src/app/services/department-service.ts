import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl = 'http://localhost:4000/api/v1';
  constructor(private http: HttpClient) {}
  getDepartments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDepartments`);
  }
}
